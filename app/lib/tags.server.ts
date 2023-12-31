import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { getFiles } from "./mdx.server";
import kebabCase from "./utils/kebabCase";

const root = process.cwd();

export async function getAllTags(type: string) {
  const files = await getFiles(type);

  let tagCount = {} as Record<string, number>;
  // Iterate through each post, putting all found tags into `tags`
  files.forEach((file: string) => {
    const source = fs.readFileSync(
      path.join(root, "app", "data", type, file),
      "utf8"
    );
    const { data } = matter(source);
    if (data.tags && data.draft !== true) {
      data.tags.forEach((tag: string) => {
        const formattedTag = kebabCase(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });

  return tagCount;
}
