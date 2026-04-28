import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Callout, Compare, LoomEmbed, Steps, YouTubeEmbed } from "@/components/blog/mdx-embeds";
import { MdxPre } from "@/components/blog/mdx-pre";

const mdxComponents = {
  pre: MdxPre,
  Callout,
  Steps,
  Compare,
  YouTubeEmbed,
  LoomEmbed,
};

export async function compileBlogMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });
  return content;
}
