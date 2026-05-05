import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  BeforeAfterCompare,
  Callout,
  Checklist,
  Compare,
  Example,
  KeyTakeaway,
  LoomEmbed,
  Mistake,
  ResumeDoctorCta,
  Steps,
  TermBlock,
  Tip,
  WarningAdvice,
  WhyAudienceGrid,
  YouTubeEmbed,
} from "@/components/blog/mdx-embeds";
import { MdxPre } from "@/components/blog/mdx-pre";

const mdxComponents = {
  pre: MdxPre,
  Callout,
  Steps,
  Compare,
  Tip,
  Mistake,
  Example,
  Checklist,
  KeyTakeaway,
  WhyAudienceGrid,
  BeforeAfterCompare,
  WarningAdvice,
  ResumeDoctorCta,
  TermBlock,
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
