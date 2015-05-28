(function($) {
	WapJS = function() {
		// css 动画
		this.doScale = function(element, scaleAction) {
			$(element).addClass(scaleAction).one($.AMUI.support.animation.end, function() {
				$(element).removeClass(scaleAction);
			});
		}
		// 遮罩层
		this.modalFade = function(content, fade) {
			if ($("#wap-modal-pannel").lenght == 0) {
				var modalHtml = '<div class="am-modal am-modal-no-btn" tabindex="-1" id="wap-modal-pannel"><div class="wap-noicon-tips"><div class="am-modal-bd"></div></div></div>';
				$("body").append(modalHtml);
			}
			$(".am-modal-bd").text(content);
			$("#wap-modal-pannel").modal("open");
			if (fade) {
				setTimeout(function() {
					$("#wap-modal-pannel").modal("close");
				}, fade);
			}
		}
	}

})(window.jQuery)