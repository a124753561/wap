var  data=[{"image":"http://img5.douban.com/lpic/o636459.jpg"},{"image":"http://img5.douban.com/lpic/o636459.jpg"},{"image":"http://img5.douban.com/lpic/o636459.jpg"},{"image":"http://img5.douban.com/lpic/o636459.jpg"},{"image":"http://img5.douban.com/lpic/o636459.jpg"},{"image":"http://img5.douban.com/lpic/o636459.jpg"},{"image":"http://img5.douban.com/lpic/o636459.jpg"}];
var EventsList = function (e1, e2, options) {
	var $main = e1;
	var $list = $main.find('#events-list');
	var $pullDown = $main.find('#pull-down');
	var $pullDownLabel = $main.find('#pull-down-label');
	var $pullUp = $main.find('#pull-up');
	var topOffset = -$pullDown.outerHeight();

	this.compiler = Handlebars.compile(e2.html());
	this.prev = this.next = this.start = options.params.start;
	this.total = 1000;


	this.renderList = function (start, type) {
		var _this = this;
		var $el = $pullDown;

		if (type === 'load') {
			$el = $pullUp;
		}
		_this.setLoading($el);
		var html = _this.compiler(data);

		if (type === 'refresh') {
			$list.html(html);
		} else if (type === 'load') {
			$list.append(html);
		} else {
			$list.html(html);
		}

		// refresh iScroll
		setTimeout(function () {
			_this.resetLoading($el);
			_this.iScroll.refresh();
		}, 100);
		if (type !== 'load') {
			_this.iScroll.scrollTo(0, topOffset, 800, $.AMUI.iScroll.utils.circular);
		}
		lazyloadimg();
	};

	this.setLoading = function ($el) {
		$el.addClass('loading');
	};

	this.resetLoading = function ($el) {
		$el.removeClass('loading');
	};

	this.init = function () {
		var myScroll = this.iScroll = new $.AMUI.iScroll('#' + e1.attr("id"), {});
		// myScroll.scrollTo(0, topOffset);
		var _this = this;
		var pullFormTop = false;
		var pullStart;

		this.renderList(options.params.start);

		myScroll.on('scrollStart', function () {
			if (this.y >= topOffset) {
				pullFormTop = true;
			}

			pullStart = this.y;
			// console.log(this);
		});

		myScroll.on('scrollEnd', function () {
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

	this.handlePullDown = function () {
		console.log('handle pull down');
		if (this.prev > 0) {
			this.setLoading($pullDown);
			this.prev = options.params.start;
			this.renderList(this.prev, 'refresh');
		} else {
			console.log('别刷了，没有了');
		}
	};

	this.handlePullUp = function () {
		console.log('handle pull up');
		if (this.next < this.total) {
			this.setLoading($pullUp);
			this.next += options.params.count;
			this.renderList(this.next, 'load');
		} else {
			console.log(this.next);
			// this.iScroll.scrollTo(0, topOffset);
		}
	}
};
document.addEventListener('touchmove', function (e) {
	e.preventDefault();
}, false);