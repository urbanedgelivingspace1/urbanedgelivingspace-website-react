import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPropertyWhatsAppMessage,
  formatCompactInr,
  formatPropertyConfiguration,
  formatPropertyPrice,
  formatPropertyType,
} from "../src/lib/propertyPresentation.js";

test("formats Indian property prices without changing source data", () => {
  const property = { price: 12_500_000, price_type: "starting_from" };
  assert.equal(formatPropertyPrice(property), "Starting from ₹1.25 Cr");
  assert.deepEqual(property, { price: 12_500_000, price_type: "starting_from" });
  assert.equal(formatCompactInr(7_500_000), "₹75 Lakh");
  assert.equal(formatPropertyPrice({}), "Price on Request");
});

test("formats BHK ranges and only uses real property types", () => {
  assert.equal(
    formatPropertyConfiguration(
      { bhk_min: 3, bhk_max: 4, property_type: ["Residential", "Villa"] },
      { includeType: true },
    ),
    "3–4 BHK Villa",
  );
  assert.equal(formatPropertyType({ property_type: ["Apartment", "Penthouse"] }), "Apartment • Penthouse");
  assert.equal(formatPropertyType({}), null);
});

test("builds a property-specific WhatsApp enquiry from existing fields", () => {
  const message = buildPropertyWhatsAppMessage({
    id: "PROP-42",
    name: "River View",
    location: "Gandhinagar",
    bhk: "3 BHK",
  });

  assert.match(message, /River View/);
  assert.match(message, /Gandhinagar/);
  assert.match(message, /3 BHK/);
  assert.match(message, /PROP-42/);
});
