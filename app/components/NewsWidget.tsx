import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { NewsItem } from '../../actions/news';

interface NewsWidgetProps {
    news: NewsItem[];
}

const NewsWidget = ({ news }: NewsWidgetProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="glass-card p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <Newspaper className="w-5 h-5 text-cyan-400" />
                <div>
                    <h3 className="text-sm font-semibold text-white">AI News</h3>
                    <p className="text-xs text-slate-500">TechCrunch</p>
                </div>
            </div>

            {/* News List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {news.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No news available
                    </div>
                ) : (
                    news.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors line-clamp-2 flex-1">
                                    {item.title}
                                </h4>
                                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 flex-shrink-0 mt-0.5" />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{formatDate(item.pubDate)}</p>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsWidget;
