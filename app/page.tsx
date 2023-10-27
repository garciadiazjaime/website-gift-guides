"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import gifts from "@/support/gift.json";

interface Gift {
  id: number;
  title: string;
  description: string;
  price: number;
  store_url: string;
  image_url: string;
  category: string;
  price_range: string;
}

export default function Home() {
  console.log(gifts);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [gift, setGift] = useState<Gift>();

  const styles = {
    container: { maxWidth: 800, margin: "0 auto", padding: "0 6px" },
    color: {
      primary: "#900a83",
      secondary: "#2d5d2a",
      gray: "#d1d1d1",
    },
  };
  const categories = ["mother-in-law", "sister", "hikers"];
  const priceRanges = [
    "under-25",
    "under-50",
    "under-100",
    "under-200",
    "over-200",
  ];

  const getCTATitle = (price: number, link: string) => {
    const domain = new URL(link);
    return `$${price} at ${domain.host.split(".")[1]}`;
  };

  useEffect(() => {
    if (!category || !priceRange) {
      setGift(undefined);
      return;
    }
    console.log("filter by", category, priceRange);
    const _gift = gifts.find(
      (item) => item.category === category && item.price_range === priceRange
    );
    setGift(_gift);
  }, [category, priceRange]);

  return (
    <div>
      <header
        style={{
          borderBottom: `1px solid ${styles.color.gray}`,
          padding: "20px 0",
          marginBottom: 20,
        }}
      >
        <h1 style={styles.container}>
          <span style={{ color: styles.color.primary }}>Best Gifts</span>
        </h1>
      </header>

      <main style={styles.container}>
        {category && (
          <section
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid black",
              padding: "0 6px",
              marginBottom: 20,
            }}
          >
            <h2 style={{ flex: 1 }}>{category}</h2>
            <div
              style={{ flex: 1, textAlign: "right", padding: 12 }}
              onClick={() => setCategory("")}
            >
              ❌
            </div>
          </section>
        )}

        {priceRange && (
          <section
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid black",
              padding: "0 6px",
              marginBottom: 20,
            }}
          >
            <h2 style={{ flex: 1 }}>{priceRange}</h2>
            <div
              style={{ flex: 1, textAlign: "right", padding: 12 }}
              onClick={() => setPriceRange("")}
            >
              ❌
            </div>
          </section>
        )}

        {!category &&
          categories.map((item) => (
            <div
              key={item}
              onClick={() => setCategory(item)}
              style={{
                width: "100%",
                border: "1px solid black",
                padding: "20px 0",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {item}
            </div>
          ))}

        {category &&
          !priceRange &&
          priceRanges.map((item) => (
            <div
              key={item}
              onClick={() => setPriceRange(item)}
              style={{
                width: "100%",
                border: "1px solid black",
                padding: "20px 0",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {item}
            </div>
          ))}

        {category && priceRange && gift && (
          <div>
            <h3 style={{ padding: "12px 0" }}>{gift.title}</h3>
            <p style={{ padding: "12px 0" }}>{gift.description}</p>
            <div style={{ padding: "12px 0" }}>${gift.price}</div>
            <div
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                padding: "12px 0",
              }}
            >
              <Image
                src={gift.image_url}
                width={245}
                height={245}
                alt=""
                style={{ objectFit: "cover" }}
              />
            </div>

            <a
              href={gift.store_url}
              target="_blank"
              style={{
                border: "1px solid black",
                display: "block",
                padding: "20px 0",
                textAlign: "center",
              }}
            >
              {getCTATitle(gift.price, gift.store_url)}
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
