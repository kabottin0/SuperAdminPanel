// react
import React from "react";

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import type { InferGetStaticPropsType } from "next";

// mongoose models
import dbConnect from "lib/dbConnect";
import HomeSlider from "models/HomeSlider";
import Brands from "models/Brands";
import Products from "models/Products";

import HomeBanners from "models/HomeBanners";

// material
import { Container } from "@mui/material/";

// skeletons
import HeroCarouselSkeleton from "src/components/skeletons/home/heroCarousel";
import BannersSkeleton from "src/components/skeletons/home/bannersSkeleton";
import { Page } from "src/components";
import SubCategories from "models/SubCategories";
import CategoriesModel from "models/Categories";
// dynamic import
const HeroCarousel = dynamic(
  () => import("src/components/carousels/heroCarousel/heroCarousel"),
  {
    loading: () => <HeroCarouselSkeleton />,
  }
);
const Banners = dynamic(() => import("src/components/_main/home/banners"), {
  loading: () => <BannersSkeleton />,
});
const Categories = dynamic(
  () => import("src/components/_main/home/categories")
);
const TopCollections = dynamic(
  () => import("src/components/_main/home/topCollections")
);
const CenteredBanner = dynamic(
  () => import("src/components/_main/home/centeredBanner")
);
import FeaturedProducts from "src/components/_main/home/featured";

const WhyUs = dynamic(() => import("src/components/_main/home/whyUs"));
const BrandsMain = dynamic(() => import("src/components/_main/home/brands"));

export const getStaticProps = async () => {
  await dbConnect();
  const slides = await HomeSlider.find();
  const brands = await Brands.find();
  const homeBanners = await HomeBanners.find({});
  await SubCategories.findOne();
  const categories = await CategoriesModel.find({}).populate("subCategories");

  const featuredProducts = await Products.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    {
      $match: {
        isFeatured: true,
      },
    },
    {
      $limit: 12,
    },
  ]);
  const topRatedProducts = await Products.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 8,
    },
  ]);

  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      slidesData: JSON.parse(JSON.stringify(slides)),
      brandData: JSON.parse(JSON.stringify(brands)),
      topRatedProducts: JSON.parse(JSON.stringify(topRatedProducts)),
      homeBanners: JSON.parse(JSON.stringify(homeBanners)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
    revalidate: 60,
  };
};

export default function Home({
  featuredProducts,
  slidesData,
  brandData,
  topRatedProducts,
  homeBanners,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("home");

  return (
    <Page
      title="NEXTSTORE Open Source Reactjs Ecommerce script"
      description="NEXTSTORE is a leading open source reactjs ecommerce script based on Nextjs and Mongodb that can be used to sell your products online"
      canonical="">
      <HeroCarousel isLoading={!slidesData} data={slidesData} />
      <Banners data={homeBanners} />
      <Container>
        <Categories categories={categories} t={t} />
        <TopCollections data={topRatedProducts} t={t} />
        {/* <CenteredBanner data={homeBanners} /> */}
        <FeaturedProducts data={featuredProducts} t={t} />
        <BrandsMain data={brandData} />
        <WhyUs />
      </Container>
    </Page>
  );
}
