"use client";

import { usePathname } from "next/navigation";

interface SchemaOrgProps {
  type: "WebPage" | "Article" | "BlogPosting" | "Product";
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
  category?: string;
  tags?: string[];
  // Product関連のプロパティ（必要に応じて）
  brand?: string;
  price?: number;
  priceCurrency?: string;
  availability?: string;
}

export default function SchemaOrg({
  type,
  title,
  description,
  datePublished,
  dateModified,
  author = "ユニフォームナビ編集部",
  image,
  category,
  tags = [],
  brand,
  price,
  priceCurrency = "JPY",
  availability,
}: SchemaOrgProps) {
  const pathname = usePathname();
  const url = `https://uniform-navi.com${pathname}`;

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://uniform-navi.com/#website",
    name: "ユニフォームナビ | 現場のチカラ - 作業服情報サイト",
    url: "https://uniform-navi.com",
    description: "作業服・ユニフォームの選び方や最新情報を提供する専門メディア。現場で働く人のための実用的な情報を発信します。",
    publisher: {
      "@type": "Organization",
      name: "ユニフォームナビ",
      logo: {
        "@type": "ImageObject",
        url: "https://uniform-navi.com/logo.png",
      },
    },
  };

  // ページタイプ別のスキーマ
  let pageSchema: any = {};

  // 記事スキーマ（Article/BlogPosting）
  if (type === "Article" || type === "BlogPosting") {
    pageSchema = {
      "@context": "https://schema.org",
      "@type": type,
      "@id": `${url}#${type.toLowerCase()}`,
      headline: title,
      description,
      image: image || "https://uniform-navi.com/images/og-default.jpg",
      author: {
        "@type": "Person",
        name: author,
      },
      publisher: {
        "@type": "Organization",
        name: "ユニフォームナビ",
        logo: {
          "@type": "ImageObject",
          url: "https://uniform-navi.com/logo.png",
        },
      },
      datePublished,
      dateModified: dateModified || datePublished,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      articleSection: category,
      keywords: tags.join(", "),
      isAccessibleForFree: true,
    };
  }

  // 商品スキーマ（Product）
  else if (type === "Product") {
    pageSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      name: title,
      description,
      image: image,
      brand: {
        "@type": "Brand",
        name: brand,
      },
      offers: {
        "@type": "Offer",
        price,
        priceCurrency,
        availability: `https://schema.org/${availability || "InStock"}`,
        url,
      },
    };
  }

  // 通常ページスキーマ（WebPage）
  else {
    pageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      name: title,
      description,
      isPartOf: {
        "@id": "https://uniform-navi.com/#website",
      },
      url,
      lastReviewed: dateModified,
      mainContentOfPage: {
        "@type": "WebPageElement",
        cssSelector: "main",
      },
    };
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://uniform-navi.com/",
      },
    ],
  };

  // 記事ページの場合、カテゴリとタイトルをパンくずに追加
  if (type === "Article" || type === "BlogPosting") {
    if (category) {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 2,
        name: category,
        item: `https://uniform-navi.com/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
      });

      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      });
    } else {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 2,
        name: "記事",
        item: "https://uniform-navi.com/posts/",
      });

      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      });
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([websiteSchema, pageSchema, breadcrumbSchema]),
      }}
    />
  );
}
