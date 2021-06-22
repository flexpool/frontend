import { faqStructure } from './';

export const faqLangs = ['en-US', 'cs'];

export const loadFaq = (lang: string) => {
  return faqStructure.map((section) => ({
    name: section.sectionName,
    contents: section.contents.map((item) => ({
      name: item,
      /**
       * "questions-about-flexpool/how-to-join.md"
       * => "how-to-join"
       */
      key: item.split('/')[1].replace('.md', ''),
      md: require(`src/docs/${lang}/faq/${item}`) as {
        attributes: { title: string };
        react: React.FC;
      },
    })),
  }));
};

export type FaqDocs = ReturnType<typeof loadFaq>;
