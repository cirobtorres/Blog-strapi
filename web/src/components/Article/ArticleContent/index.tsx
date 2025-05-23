"use server";

import { convertToHTML } from "@/utils/convertToHtml";
import {
  ParseRichTextBlocks,
  ParseSliderBlocks,
  ParseQuizBlocks,
  ParseDetails,
} from "./ParseBlocks";

const ArticleContent = async ({ documentId, content }: ArticleContent) => {
  const toRender = await Promise.all(
    content.map(async (block) => {
      switch (block.__typename) {
        case "ComponentSharedRichText":
          const richTextToRenderA = await convertToHTML(block.body);
          return (
            <ParseRichTextBlocks
              key={`shared.rich-text-${block.id}`}
              body={richTextToRenderA}
            />
          );
        case "ComponentSharedDetails":
          const { id, title, collapsible, body } = block;
          const richTextToRenderB = await convertToHTML(body);
          return (
            <ParseDetails
              key={`shared.details-${id}`}
              id={id}
              collapsible={collapsible}
              title={title}
              body={richTextToRenderB}
            />
          );
        case "ComponentSharedQuiz":
          return (
            <ParseQuizBlocks key={`shared.quiz-${block.id}`} block={block} />
          );
        case "ComponentSharedSlider":
          return (
            <ParseSliderBlocks
              key={`shared.slider-${block.id}`}
              block={block as SharedSlider}
            />
          );
        default:
          return null;
      }
    })
  );

  return (
    <div
      id={documentId}
      className="mt-4 pb-12 flex flex-col col-start-2 max-[800px]:col-start-auto" // relative
    >
      {toRender}
    </div>
  );
};

export default ArticleContent;
