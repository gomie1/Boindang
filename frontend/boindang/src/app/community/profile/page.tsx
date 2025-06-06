'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackArrowIcon from '@/components/common/BackArrowIcon';
import MyPostCard from '@/components/myposts/MyPostCard';
import { getMyPosts, getImageListByIds } from '@/api/community';
import { getUserInfo } from '@/api/auth';
import type { ApiPostItem } from '@/types/api/community';
import BottomNavBar from '@/components/navigation/BottomNavBar';

// 임시 '작성한 글 없음' 아이콘 (실제 아이콘 컴포넌트로 대체 필요)
const EmptyPlaceholder = () => (
  <div className="flex flex-col items-center justify-center text-center h-full text-gray-500 pt-16">
    {/* TODO: 적절한 아이콘으로 교체 */}
    <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <p>작성한 글이 없습니다.</p>
  </div>
);

export default function ProfilePage() {
  const [myPosts, setMyPosts] = useState<ApiPostItem[]>([]);
  const [imageUrlsMap, setImageUrlsMap] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await getUserInfo();
      if (res.success && res.data) {
        setNickname(res.data.nickname);
        // if (res.data.profileImageUrl) setProfileImageUrl(res.data.profileImageUrl);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      setIsLoading(true);
      setError(null);
      setMyPosts([]);
      setImageUrlsMap(new Map());
      try {
        const apiResponse = await getMyPosts();
        if (apiResponse.success && apiResponse.data) {
          setMyPosts(apiResponse.data);
          const imageIdsToFetch = apiResponse.data
            .map(post => post.imageId)
            .filter((id): id is number => id !== null && id !== undefined);
          if (imageIdsToFetch.length > 0) {
            const uniqueImageIds = [...new Set(imageIdsToFetch)];
            const imageListResponse = await getImageListByIds(uniqueImageIds as number[]);
            if (imageListResponse.success && imageListResponse.data) {
              const imageList = imageListResponse.data;
              const newImageUrlsMap = new Map<number, string>();
              imageList.forEach(image => {
                newImageUrlsMap.set(image.imageId, image.imageUrl);
              });
              setImageUrlsMap(newImageUrlsMap);
            }
          }
        } else {
          setError(apiResponse.error?.message || '내가 쓴 글을 불러오는데 실패했습니다.');
        }
      } catch {
        setError('내가 쓴 글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center p-4 bg-background">
        <Link href="/community" className="mr-4 text-text-primary">
          <BackArrowIcon size={24} weight="bold" />
        </Link>
      </header>

      {/* Profile Info */}
      <section className="p-4 flex items-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border border-gray-200 flex-shrink-0 bg-gray-200">
          {/* TODO: 프로필 이미지 컴포넌트로 대체 */}
        </div>
        <div>
          <h1 className="text-lg font-semibold flex items-center text-text-primary">
            {nickname}
          </h1>
          <p className="text-sm text-gray-500">
            작성글 {myPosts.length}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-200 ease-in-out text-[#6C2FF2] border-b-2 border-[#6C2FF2]`}
        >
          내가 작성한 글
        </button>
      </nav>

      {/* Content Area */}
      <main className="flex-grow p-4 bg-white">
        {isLoading ? (
          <div className="text-center text-gray-400 pt-16">로딩 중...</div>
        ) : error ? (
          <div className="text-center text-red-500 pt-16">{error}</div>
        ) : myPosts.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          myPosts.map(post => (
            <MyPostCard
              key={post.postId}
              postId={post.postId}
              category={post.category ?? ''}
              content={post.content}
              imageUrl={post.imageId ? imageUrlsMap.get(post.imageId) ?? undefined : undefined}
              username={post.username}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
              likedByMe={post.likedByMe}
              createdAt={post.createdAt}
            />
          ))
        )}
      </main>
      <BottomNavBar />
    </div>
  );
} 