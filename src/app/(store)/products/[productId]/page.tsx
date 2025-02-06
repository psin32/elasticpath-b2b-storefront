import { Metadata } from "next";
import { ProductDetailsComponent, ProductProvider } from "./product-display";
import { getServerSideImplicitClient } from "../../../../lib/epcc-server-side-implicit-client";
import {
  getNodesByIds,
  getProductBySlug,
  getSubscriptionOfferingByProductId,
} from "../../../../services/products";
import { notFound } from "next/navigation";
import { parseProductResponse } from "../../../../shopper-common/src";
import React from "react";
import { CustomRelationship, Node, Resource } from "@elasticpath/js-sdk";
import { builder } from "@builder.io/sdk";
import { cmsConfig } from "../../../../lib/resolve-cms-env";
import { getServerSideCredentialsClient } from "../../../../lib/epcc-server-side-credentials-client";
builder.init(process.env.NEXT_PUBLIC_BUILDER_IO_KEY || "");

export const dynamic = "force-dynamic";

type Props = {
  params: { productId: string };
};

export async function generateMetadata({
  params: { productId },
}: Props): Promise<Metadata> {
  const client = getServerSideImplicitClient();
  const product = await getProductBySlug(productId, client);

  if (!product) {
    notFound();
  }

  return {
    title: product.data?.[0]?.attributes.name,
    description: product.data?.[0]?.attributes.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { enableBuilderIO } = cmsConfig;
  const client = getServerSideCredentialsClient();
  const product = (await getProductBySlug(params.productId, client)) as any;
  if (!product.data?.[0]?.id) {
    notFound();
  }

  const contentData = async () => {
    if (enableBuilderIO) {
      const content = await builder
        .get("page", {
          userAttributes: { urlPath: `/products/${params.productId}` },
          prerender: false,
        })
        .toPromise();
      return content;
    }
  };
  const content = await contentData();

  const offerings = await getSubscriptionOfferingByProductId(
    product?.data?.[0]?.id,
    client,
  );

  const breadCrumNode = product?.data?.[0].meta?.bread_crumb_nodes?.[0] || "";
  const nodeIds: string[] = [];
  const parentNodes =
    (breadCrumNode &&
      product?.data?.[0].meta?.bread_crumbs?.[breadCrumNode].reverse()) ||
    [];
  nodeIds.push(breadCrumNode, ...parentNodes);
  const breadcrumb: Node[] | undefined = await getNodesByIds(nodeIds, client);

  const shopperProduct = (await parseProductResponse(product, client)) as any;
  const mainRelationship =
    shopperProduct?.response?.meta?.custom_relationships || [];
  const baseProductRelationship =
    shopperProduct?.baseProduct?.meta?.custom_relationships || [];
  const customRelationshipSlug: string[] = Array.from(
    new Set(mainRelationship.concat(baseProductRelationship)),
  );
  const exclusionList: string[] = (
    process.env.NEXT_PUBLIC_EXCLUDE_CUSTOM_RELATIONSHIP || ""
  ).split(",");
  const relationship: any = [];
  for (const slug of customRelationshipSlug) {
    if (!exclusionList.includes(slug)) {
      const response: Resource<CustomRelationship> =
        await client.CustomRelationships.Get(slug);
      relationship.push({
        slug,
        name: response.data.attributes.name,
        description: response.data.attributes.description,
      });
    }
  }

  return (
    <div key={"page_" + params.productId}>
      <ProductProvider>
        <ProductDetailsComponent
          product={shopperProduct}
          breadcrumb={breadcrumb}
          offerings={offerings}
          content={content}
          relationship={relationship}
        />
      </ProductProvider>
    </div>
  );
}
