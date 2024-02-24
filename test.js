import { returnTags } from "./dist/src/getOZERC721Tags.js"; // Adjust the path as necessary
import { writeFile } from "fs/promises";

function jsonToCSV(items) {
  if (items.length === 0) return ""; // Handle case where no items are passed
  const replacer = (key, value) => (value === null ? "" : value);
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  return csv;
}

async function gatherTagsForMultipleChains(chainIds, apiKey) {
  let allTags = [];
  for (const chainId of chainIds) {
    try {
      const tags = await returnTags(chainId.toString(), apiKey);
      allTags = allTags.concat(tags);
    } catch (error) {
      console.error(`Error fetching tags for chain ID ${chainId}:`, error);
    }
  }
  return allTags;
}

async function test() {
  const chainIds = ["56", "137", "100"]; // Example chain IDs: Ethereum, BSC, Polygon, Gnosis Chain
  const apiKey = "A20CharacterApiKeyThatWorks";

  try {
    const tags = await gatherTagsForMultipleChains(chainIds, apiKey);
    if (tags.length > 0) {
      // Convert JSON to CSV
      const csv = jsonToCSV(tags);
      // Output CSV to a file
      await writeFile("tags.csv", csv);
      console.log("Tags have been written to tags.csv");
    } else {
      console.log("No tags were gathered.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

test();
