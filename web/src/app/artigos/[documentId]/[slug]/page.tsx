import Hero from "../../../../components/Hero";
import Article from "../../../../components/Article";
import TagsRelated from "../../../../components/TagsRelated";
import RelatedArticles from "../../../../components/RelatedArticles";
import { getArticle } from "../../../../service/articles";
import { DynamicBody } from "../../../../components/Body";
import { getGlobal } from "../../../../service/global";
import { getUserMeLoader } from "@/service/user/user-me-loader";
import { CommentProvider } from "@/providers/CommentProvider";
import Comments from "@/components/Comments";

export async function generateMetadata({ params }: Params) {
  const { documentId } = await params;
  const { data: global } = await getGlobal();
  const { data: article } = await getArticle(documentId);

  return {
    title: `${global.siteName} | ${article.title}`,
    description: article.title,
  };
}

interface Params {
  params: {
    documentId: string;
    slug: string;
  };
}

export default async function ArticlesPage({ params }: Params) {
  const { documentId } = await params;
  const { data: article } = await getArticle(documentId);
  const user = await getUserMeLoader();

  if (article) {
    return (
      <DynamicBody>
        <Hero article={article} currentUser={user} />
        <Article documentId={documentId} content={article.blocks} />
        <TagsRelated
          topic={article.topic}
          tools={article.tools}
          tags={article.tags}
        />
        <RelatedArticles />
        <CommentProvider>
          <Comments currentUser={user} />
        </CommentProvider>
      </DynamicBody>
    );
  }
}
