package com.boindang.community.dto.response;

import java.time.LocalDateTime;

import com.boindang.community.entity.Post;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostSimpleResponse {
	private Long postId;
	private String category;
	private LocalDateTime createdAt;

	public static PostSimpleResponse from(Post post) {
		return PostSimpleResponse.builder()
			.postId(post.getId())
			.category(post.getCategory())
			.createdAt(post.getCreatedAt())
			.build();
	}
}

