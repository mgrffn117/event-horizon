"use server";

import Parser from 'rss-parser';

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
}

export async function getAINews(): Promise<NewsItem[]> {
    const parser = new Parser();
    const feedUrl = 'https://techcrunch.com/category/artificial-intelligence/feed/';

    try {
        const feed = await parser.parseURL(feedUrl);

        // Return top 5 most recent items
        const items = feed.items.slice(0, 5).map(item => ({
            title: item.title || 'Untitled',
            link: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString(),
        }));

        return items;
    } catch (error) {
        console.error('Error fetching AI news:', error);
        // Return empty array on error to prevent dashboard crash
        return [];
    }
}
