'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical } from 'lucide-react';
import { compactNumber } from '@/lib/format';
import type { FeedPost } from './data';

/**
 * Shared post card used by the Feed and the vendor shop "Posts" tab.
 * Keeps its own like / save / expand state.
 */
export default function PostCard({ post, index = 0 }: { post: FeedPost; index?: number }) {
  const [liked, setLiked] = useState(!!post.isLiked);
  const [saved, setSaved] = useState(!!post.isSaved);
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLikes((n) => (liked ? n - 1 : n + 1));
    setLiked((v) => !v);
  };

  const vendorHref = `/vendors/${encodeURIComponent(post.vendorName)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.4 }}
      className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      {/* Header — vendor • date */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <Link href={vendorHref} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] ring-1 ring-slate-900/5">
            <span className="text-sm font-bold text-white">{post.vendorName[0]}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-ink">{post.vendorName}</h3>
              {post.verified && (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-trust text-[8px] font-bold text-white">
                  ✓
                </span>
              )}
              {post.timeAgo && <span className="text-xs text-slate-400">· {post.timeAgo}</span>}
            </div>
            {typeof post.followers === 'number' && post.followers > 0 && (
              <p className="text-[11px] text-slate-400">
                {compactNumber(post.followers)} followers
              </p>
            )}
          </div>
        </Link>
        <button
          aria-label="More options"
          className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Image — large rounded square */}
      <Link href={vendorHref} className="block px-3.5">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={`${post.vendorName} post`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
              <MessageCircle size={28} />
            </div>
          )}
        </div>
      </Link>

      {/* Actions + caption */}
      <div className="px-3.5 pb-3.5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} aria-label="Like" className="group flex items-center gap-1.5">
              <Heart
                size={20}
                className={`transition-colors ${
                  liked ? 'fill-[#FA3728] text-[#FA3728]' : 'text-slate-700 group-hover:text-[#FA3728]'
                }`}
              />
              <span className="text-sm font-semibold text-ink">{likes}</span>
            </button>
            <button className="group flex items-center gap-1.5" aria-label="Comments">
              <MessageCircle
                size={20}
                className="text-slate-700 transition-colors group-hover:text-[#FA3728]"
              />
              <span className="text-sm font-semibold text-ink">{post.comments}</span>
            </button>
            <button className="group" aria-label="Share">
              <Share2
                size={20}
                className="text-slate-700 transition-colors group-hover:text-[#FA3728]"
              />
            </button>
          </div>
          <button onClick={() => setSaved((v) => !v)} aria-label="Save">
            <Bookmark
              size={20}
              className={`transition-colors ${
                saved ? 'fill-[#FA3728] text-[#FA3728]' : 'text-slate-700 hover:text-[#FA3728]'
              }`}
            />
          </button>
        </div>

        {/* Caption */}
        <div className="mt-2.5 text-sm leading-relaxed text-slate-700">
          <Link href={vendorHref} className="font-bold text-ink">
            {post.vendorName}
          </Link>{' '}
          {expanded ? (
            <>
              {post.caption}{' '}
              {post.caption.length > 100 && (
                <button
                  onClick={() => setExpanded(false)}
                  className="font-medium text-slate-400 hover:text-slate-600"
                >
                  see less
                </button>
              )}
            </>
          ) : (
            <>
              {post.caption.length > 100 ? `${post.caption.substring(0, 100)}… ` : post.caption}
              {post.caption.length > 100 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="font-medium text-slate-400 hover:text-slate-600"
                >
                  more
                </button>
              )}
            </>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/explore?q=${encodeURIComponent(tag)}`}
                className="text-[11px] font-medium text-[#FA3728] hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-3 border-t border-slate-100 pt-3">
          <Link
            href={`/chats/${post.vendorName.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-50 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-[#FA3728] hover:text-white"
          >
            <MessageCircle size={16} />
            Order via Chat
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
