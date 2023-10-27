const fetch = require("node-fetch");
const cheerio = require("cheerio");
const sqlite3 = require("sqlite3").verbose();
var shajs = require("sha.js");

const extract = async (url) => {
  const response = await fetch(url);

  return await response.text();
};

const transform = (html, category) => {
  const gifts = [];
  const $ = cheerio.load(html);

  $(".product")
    .toArray()
    .map((item) => {
      const _price =
        $(item).find(".product-tile-price .product-buy-price").text() ||
        $(item).find(".product-price .product-buy-price").text();
      const price = parseFloat(_price.trim().replace("$", ""));

      const range = [25, 50, 100, 200, Number.POSITIVE_INFINITY];
      const getPriceRange = (_price, index) => {
        if (index >= range.length) {
          return;
        }

        if (_price <= range[index]) {
          return index + 1;
        }

        return getPriceRange(_price, (index += 1));
      };

      const title = $(item).find(".product-name a").text().trim();
      const store_url = $(item).find(".product-name a").attr("href");
      const sha = shajs("sha256").update(`${title}${store_url}`).digest("hex");

      const gift = {
        title,
        description: $(item).find(".product-description").text().trim(),
        price,
        store_url,
        image_url: $(item).find(".product-image-img").attr("src"),
        category,
        price_range: getPriceRange(price, 0),
        sha,
      };

      gifts.push(gift);
    });

  return gifts;
};

async function load(gifts) {
  console.log(`gifts found: ${gifts.length}`);
  let db = new sqlite3.Database("../django-models/mint_models/db.sqlite3");

  gifts.forEach((gift) => {
    const query = `SELECT id FROM gift_gift where sha="${gift.sha}"`;
    db.get(query, function (err, row) {
      if (err) {
        return console.log(err.message);
      }

      if (!row) {
        db.run(
          `INSERT INTO gift_gift(title, description, price, store_url, image_url, category_id, price_range_id, sha) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            gift.title,
            gift.description,
            gift.price,
            gift.store_url,
            gift.image_url,
            gift.category,
            gift.price_range,
            gift.sha,
          ],
          function (err) {
            if (err) {
              return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
          }
        );
        return;
      }

      db.run(
        `UPDATE gift_gift SET
          title=?,
          description=?,
          price=?,
          store_url=?,
          image_url=?,
          category_id=?,
          price_range_id=?
        WHERE sha=?`,
        [
          gift.title,
          gift.description,
          gift.price,
          gift.store_url,
          gift.image_url,
          gift.category,
          gift.price_range,
          gift.sha,
        ],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`A row has been updated with rowid ${row.id}`);
        }
      );
    });
  });

  db.close();
}

async function main() {
  console.log("starting");

  const links = [
    {
      url: "https://nymag.com/strategist/article/best-gift-ideas-for-mothers-in-law.html",
      category: 1, //"mother-in-law",
    },
  ];

  const link = links[0];
  const html = await extract(link.url);

  const gifts = transform(html, link.category, link.priceRange);

  load(gifts);
}

main().then(() => console.log("end"));
