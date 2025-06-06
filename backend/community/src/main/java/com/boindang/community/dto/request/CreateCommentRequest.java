package com.boindang.community.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateCommentRequest {
	private String content;

	@Builder
	public CreateCommentRequest(String content) {
		this.content = content;
	}
}
