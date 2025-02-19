import { type GetStaticProps } from 'next';

import { NotionPage } from '@/components/NotionPage';
import { domain } from '@/lib/config';
import { getSiteMap } from '@/lib/get-site-map';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { type PageProps, type Params } from '@/lib/types';

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context,
) => {
  const rawPageId = context.params.pageId as string;

  try {
    const props = await resolveNotionPage(domain, rawPageId);

    return { props };
  } catch (err) {
    console.error('page error', domain, rawPageId, err);

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err;
  }
};

export async function getStaticPaths() {
  const siteMap = await getSiteMap();

  const staticPaths = {
    paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
      params: {
        pageId,
      },
    })),
    fallback: false,
  };

  return staticPaths;
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage pageWidth={720} {...props} />;
}
