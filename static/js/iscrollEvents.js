(function($) {
	EventsList = function(e1, e2, options) {
		var $main = $(e1);
		var $list = $main.find('#events-list');
		var $pullDown = $main.find('#pull-down');
		var $pullDownLabel = $main.find('#pull-down-label');
		var $pullUp = $main.find('#pull-up');
		var topOffset = -$pullDown.outerHeight();

		this.compiler = Handlebars.compile($(e2).html());
		this.prev = this.next = this.start = options.params.pageNumber;
		this.total = null;

		this.getURL = function(params) {
			var queries = [];
			for ( var key in params) {
				if (key !== 'pageNumber') {
					queries.push(key + '=' + params[key]);
				}
			}
			queries.push('pageNumber=');
			return options.api + '?' + queries.join('&');
		};

		this.renderList = function(start, type) {
			var _this = this;
			var $el = $pullDown;

			if (type === 'load') {
				$el = $pullUp;
			}

			$.ajax({
				url : this.URL + start,
				type : "get",
				dataType : "json",
				success : function(data) {
					console.log(data);
					_this.total = 2000;
					var html = _this.compiler(data);
					if (type === 'refresh') {
						$list.children('li').first().before(html);
					} else if (type === 'load') {
						$list.append(html);
					} else {
						$list.html(html);
					}
					// refresh iScroll
					setTimeout(function() {
						_this.iScroll.refresh();
					}, 100);
					_this.resetLoading($el);
					if (type !== 'load') {
						_this.iScroll.scrollTo(0, topOffset, 800, $.AMUI.iScroll.utils.circular);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					 console.log(XMLHttpRequest.status);
                        console.log(XMLHttpRequest.readyState);
                        console.log(textStatus);
					}
			});
		};

		this.setLoading = function($el) {
			$el.addClass('loading');
		};

		this.resetLoading = function($el) {
			$el.removeClass('loading');
		};

		this.init = function() {
			var myScroll = this.iScroll = new $.AMUI.iScroll(e1, {});
			// myScroll.scrollTo(0, topOffset);
			var _this = this;
			var pullFormTop = false;
			var pullStart;

			this.URL = this.getURL(options.params);
			this.renderList(options.params.pageNumber);

			myScroll.on('scrollStart', function() {
				if (this.y >= topOffset) {
					pullFormTop = true;
				}

				pullStart = this.y;
				// console.log(this);
			});

			myScroll.on('scrollEnd', function() {
				if (pullFormTop && this.directionY === -1) {
					_this.handlePullDown();
				}
				pullFormTop = false;

				// pull up to load more
				if (pullStart === this.y && (this.directionY === 1)) {
					_this.handlePullUp();
				}
			});
		};

		this.handlePullDown = function() {
			console.log('handle pull down');
			if (this.prev > 0) {
				this.setLoading($pullDown);
				this.prev -= options.params.pageSize;
				this.renderList(this.prev, 'refresh');
			} else {
				console.log('别刷了，没有了');
			}
		};

		this.handlePullUp = function() {
			console.log('handle pull up');
			if (this.next < this.total) {
				this.setLoading($pullUp);
				this.next += options.params.pageSize;
				this.renderList(this.next, 'load');
			} else {
				console.log(this.next);
				// this.iScroll.scrollTo(0, topOffset);
			}
		}
	};

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
})(window.jQuery);