
var LanmeiAirlines = {
	cityData: LMComData.cityData,
	cityDataAuto: LMComData.cityDataAuto,
	thFromCityData: LMThData.thFromCityData,
	thToCityData: LMThData.thToCityData,
	fNumberData: LMComData.fNumberData,
	hotelCityData: ['Hong Phann Guest House','Phkar Chhouk Tep Monireth Hotel','Tt Guest House','Phkar Chhouk Tep 2 Hotel'],
	carRouteData: ['Phnom Penh International Airport --> Toyoko Inn Phnom Penh','Phnom Penh International Airport -->  Hotel Sofitel Phnom Penh Phokeethra'],
	carTicketTypeData: ['One-way','Return'],
	indexLiFrom: 0, //定义键盘移动index 
	indexLiTo: 0,
	indexLiFlightNum: 0,
	indexLiRouteFrom: 0,
	indexLiRouteTo: 0,
	init:function(){
		this.banner();
		this.selectPeople();
		this.selectThPeople();
		this.selectHotelRooms();
		this.ticketCommon();
		this.quickTicket();
		this.otherEvent();
		this.isPc();
		this.isIE();
	},

	/* banner */
	banner:function(){
		$.ajax({
			url: 'http://47.96.117.26/article/importantListApiEn.jhtml',
			type: 'POST',
			dataType: 'json',
		})
		.done(function(res) {
			if (res.length > 0) {
				// imgUrl
				$('.js-slick-banner').empty();
				$.each(res, function(index, el) {
					let child = `<div class="slick-item">
						<div class="slick-shadow">
							<a href="${el.url}" class="img-box" target="_blank">
								<img src="imgage_demo/banner-scroll-1.png">
							</a>
							<div class="slick-content">
								<a href="${el.url}" title="${el.title}" target="_blank">${el.title}</a>
								<div class="slick-detail">
									<p title="${el.content}">${el.content}</p>
								</div>
							</div>
						</div>
					</div>`;
					$('.js-slick-banner').append(child);
				});

				$('.js-slick-banner').slick({
					dots: false,
					slidesToShow: 4,
					slidesToScroll: 1,
					autoplay: false,
					autoplaySpeed: 3000,
					responsive: [
						{
							breakpoint: 767,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 1,
							}
						}
					],
				});
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	},

	/* 判断是PC端还是移动端 */
	isPc:function(){
		// 判断手机端或者PC端
		function IsPC() {
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone"];
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		}

		var flag = IsPC(); //true为PC端，false为手机端

		if(flag){
			this.pcEvent();
			this.leftAside();
			this.asideMenu();
			this.ticketSelect();
			// 判断是否为ie浏览器
			var agent = navigator.userAgent.toLowerCase();
			if (window.ActiveXObject || "ActiveXObject" in window || (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) ){
				// alert("ie");
				$('.js-cloud-iframe').remove();
			}else{
				// $('.js-cloud-iframe').attr('src','libs/clouds/lm-cloud.html');
				// $('#videoSource').prop('src','video/cloud-video.mp4');
				// 视频
				// var videoHeight = function(){
				// 	var winHeight = $(window).height();
				// 	$('.videoSource').height(winHeight-60);
				// }
				// videoHeight();
				// $('#videoSource')[0].play(); 
				
				// $(window).resize(function(){
				// 	videoHeight();
				// });
			}
		}else{
			this.mobileEvent();
			this.mLeftAside();
			this.mAsideMenu();
			this.mTicketSelect();
		}
	},

	/* 判断ie版本 */
	isIE:function(){
		// ie兼容性判断
		if(document.all && document.addEventListener && !window.atob){ // IE9
			
		}else if (document.all && document.querySelector && !document.addEventListener) { //IE8
			location.href = 'https://lanmeiairlines.com/lanmeiairlines2.0/default/others/browser/EN/browser.html';
		}
	},

	/* PC端事件 */
	pcEvent:function(){
		// 定义滚动条
		// var nice = $("body").niceScroll({
		// 	cursorborderradius: 0,
		// 	cursorwidth: "8px",
		// 	cursorfixedheight: 150,
		// 	cursorcolor: "#1f2c5c",
		// 	zindex: 9999,
		// 	cursorborder: 0,
		// 	scrollspeed: 26,
		// 	mousescrollstep: 36,
		// });

		/* 二维码隐藏 */
		$(window).scroll(function(){
			var sTop = $(window).scrollTop();
			if(sTop>150){$('.lm-aside-code .small-code').fadeOut()}else{$('.lm-aside-code .small-code').fadeIn()}
		});
	},

	/* 移动端事件 */
	mobileEvent:function(){
		// 语言切换
		$('.js-mLang-menu>a').click(function(e) {
			e.stopPropagation();
			var data = $(this).attr('data');
			switch (data) {
				case 'en':
				$('.js-mh-lang').removeClass('h-lang-zh').addClass('h-lang-en');
				break;
				case 'zh':
				$('.js-mh-lang').removeClass('h-lang-en').addClass('h-lang-zh');
				break;
			}
		});

		$('.js-from-input,.js-to-input,.js-hotelFrom-input,.js-routeId-input,.js-ticketType-input,.js-fNumber-input,.js-routeFrom-input,.js-routeTo-input').attr('readonly','readonly');
		$('.js-select-way').css('visibility','visible');
		// $('.js-select-way,.js-flight-way').addClass('animated fadeInUp');

		// banner
		$('.slick-item-hover').click(function(event) {
			$('.banner-click-hover').show();
		});
		$('.banner-click-hover').click(function(event) {
			$(this).hide();
		});
	},

	/* 导航栏 */
	asideMenu:function(){
		// 定义下拉导航DOM
		var $subNav = $('.js-nav-sub');
		// 获取下拉导航高度
		var subHeight = '272px';

		function showSub(subHeight) {
			// $subNav.stop().slideDown();
			if(subHeight != '0') {
				$subNav.css({'height': subHeight,'padding': '30px 50px'});
			}else {
				$subNav.css({'height': subHeight,'padding': '0 50px'});
			}
			// $subNav.show();
		}
		function hideSub() {
			// $subNav.stop().slideUp();
			$subNav.css({'height': '0','padding': '0 50px'});
			// $subNav.hide();
		}

		// 导航栏下拉框hover
		$subNav.hover(function(){
			$.each($('.js-nav-second>ul'),function(idx,val){
				if($(val).attr('data')=='show') {
					$('.js-nav-first a[href="#'+$(val).attr('id')+'"]').parent('li').addClass('active').siblings('li').removeClass('active');
				}
			});
			showSub(subHeight);
		},function(){
			$(".js-nav-first li").removeClass('active');
			hideSub();
		});

		// 导航栏hover
		$(".js-nav-first li").hover(function(e){ 
			if($(this).children('a').attr('data-href')) {
				$(this).addClass('active').siblings('li').removeClass('active');
				return;
			}
			var navId = $(this).children('a').attr('href');
			$('.js-nav-second>ul').hide();
			$('.js-nav-three>ul').hide();
			$(navId).show().attr('data','show').siblings('ul').attr('data','');
			$(navId.replace('#','.three-')).show();

			$(this).addClass('active').siblings('li').removeClass('active');

			// 获取导航栏下拉框高度
			if(navId == '#f-list-1') {
				subHeight = '224px';
			}else if(navId == '#f-list-2') {
				subHeight = '424px';
			}else if(navId == '#f-list-3') {
				subHeight = '267px';
			}else if(navId == '#f-list-4') {
				subHeight = '114px';
			}else if(navId == '#f-list-5') {
				subHeight = '0';
			}else {
				subHeight = '148px';
			}
			showSub(subHeight);
		},function(){
			$(this).removeClass('active');
			hideSub();
		});

		// 一级和二级导航栏点击的时候
		$(".js-nav-first li a,.js-nav-second li a").click(function(e){
			!$(this).attr('data-href') && e.preventDefault();
		});
	},

	/* 移动端导航栏切换 */
	mAsideMenu:function(){
		var $container = $('.js-nav-container');
		var $box = $('.js-nav-box');
		var $backSecond = $('.js-navBack-second');
		var $backThree = $('.js-navBack-three');
		var $close = $('.js-menu-close');
		var $firstMenu = $('.js-nav-first');
		var $secondMenu = $('.js-nav-second');
		var $threeMenu = $('.js-nav-three');
		var $setting = $('.js-nav-settings');
		var $mask = $('.js-nav-mask');
		var winWidth = $(window).width();

		$('.js-nav-second>ul:first,.js-nav-three>ul:first').show();
		$close.text('');

		// 关闭侧边栏方法
		var closeAside = function(){
			$container.css('left',-270);
			$mask.hide();
			$close.css('left',-200);
			$backSecond.css('left',-200);
			$backThree.css('left',-200);
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		};

		var ovfHiden = function(){
			$('html,body').addClass('ovfHiden'); //使网页不可滚动
		};

		// 打开导航栏
		$('.js-h-menu').click(function(e){
			e.stopPropagation();
			$container.css('left',0);
			$mask.show();
			$close.css('left',220);
			$backSecond.css('left',220);
			$backThree.css('left',220);
			ovfHiden();
		});
		$close.click(function(event) {
			closeAside();
			$mask.hide();
		});

		// 阻止冒泡
		$container.click(function(e) {
			e.stopPropagation();
		});
		$mask.click(function(event) {
			closeAside();
		});

		// 点击一级菜单
		$('.js-nav-first a').click(function(e) {
			// 如果没有链接，则阻止跳转
			!$(this).attr('data-href') && e.preventDefault();

			$close.hide();
			$backSecond.show();
			$box.css('margin-left',-270+'px');
			$setting.fadeOut();

			var id = $(this).attr('href');
			$(id).show().siblings('ul').hide();
		});

		// 点击二级菜单
		$('.js-nav-second a').click(function(e) {
			// 如果没有链接，则阻止跳转
			!$(this).attr('data-href') && e.preventDefault();

			if(!$(this).attr('data-href')){
				$backSecond.hide();
				$backThree.show();
				$box.css('margin-left',-540+'px');

				var id = $(this).attr('href');
				$(id).show().siblings('ul').hide();
			}
		});

		// 返回到一级菜单
		$backSecond.click(function(event) {
			$close.show();
			$backSecond.hide();
			$setting.fadeIn();
			$box.css('margin-left',0+'px');
		});
		// 返回到二级菜单
		$backThree.click(function(event) {
			$backThree.hide();
			$backSecond.show();
			$box.css('margin-left',-270+'px');
		});
	},

	/* 左侧边栏切换 */
	leftAside:function(){
		var $slide = $('.js-aside-flight>li>a');

		var ticketShow = function(){
			$('.js-a-ticket').parent('li').addClass('active');
			$('.js-flight-com').hide();
			$('.js-ticket-wrap').show();
		};

		var hotelShow = function(){
			$('.js-a-hotel').parent('li').addClass('active');
			$('.js-flight-com').hide();
			$('.js-hotel-wrap').show();
		};

		var ticketHotelShow = function(){
			$('.js-a-ticketHotel').parent('li').addClass('active');
			$('.js-flight-com').hide();
			$('.js-ticketHotel-wrap').show();
		};

		var carShow = function(){
			$('.js-a-car').parent('li').addClass('active');
			$('.js-flight-com').hide();
			$('.js-car-wrap').show();
		};

		var flightShow = function(){
			$('.js-a-flight').parent('li').addClass('active');
			$('.js-flight-com').hide();
			$('.js-fStatus-wrap').show();
		};

		var that = this;
		$slide.click(function(){
			var href = $(this).attr('data-href');
			if(href != 'news-content') {
				$slide.parent('li').removeClass('active');
			}
			switch (href) {
				case "ticket-content":
					ticketShow();
				break;
				case "hotel-content":
					hotelShow();
				break;
				case "ticketHotel-content":
					ticketHotelShow();
				break;
				case "car-content":
					carShow();
				break;
				case "flight-content":
					flightShow();
				break;
			}
		}).one('click',function(){
			var href = $(this).attr('data-href');
			switch (href) {
				case "ticket-content":

				break;
				case "hotel-content":
				that.hotelSelect();
				break;
				case "ticketHotel-content":
					that.ticketHotelSelect();
				break;
				case "car-content":
				that.carSelect();
				break;
				case "flight-content":
				that.fStatusSelect();
				break;
			}
		});
	},

	/* 移动端左侧边栏切换 */
	mLeftAside:function(){
		var that = this;
		var $slide = $('.js-aside-flight>li>a');
		var $loader = $('.js-flight-loading');
		// 滑动动画
		$slide.click(function(){
			var href = $(this).attr('data-href');

			if(href != 'news-content') {
				$loader.fadeIn();
				$('.js-flight-com').hide();
				$(this).addClass('active').parent().siblings().children('a').removeClass('active');
			}

			switch (href) {
				case "ticket-content":
					$('.js-ticket-wrap').show();
					$loader.fadeOut();
				break;
				case "hotel-content":
					$('.js-hotel-wrap').show();
					$loader.fadeOut();
				break;
				case "ticketHotel-content":
					$('.js-ticketHotel-wrap').show();
					$loader.fadeOut();
				break;
				case "car-content":
					$('.js-car-wrap').show();
					$loader.fadeOut();
				break;
				case "flight-content":
					$('.js-fStatus-wrap').show();
					$loader.fadeOut();
				break;
			}
		}).one('click',function(){
			var href = $(this).attr('data-href');
			switch (href) {
				case "ticket-content":
				break;
				case "hotel-content":
					that.mHotelSelect();
				break;
				case "ticketHotel-content":
					that.mTicketHotelSelect();
				break;
				case "car-content":
					that.mCarSelect();
				break;
				case "flight-content":
					that.mfStatusSelect();
				break;
			}
		});
	},

	/* 日期选择 */
	dateSelect:function(single,id,container,showTotleDay,box,dateBox,peopleBox,showDateTitle1,showDateTitle2){
		// 日期选择
		var formatDate = function(num) { //日期格式化
			return num < 10 ? (num = '0' + num) : num;
		};

		var formatMonth = function(month){
			var monthEn;
			switch (month) {
				case 1: monthEn = 'Jan';break;
				case 2: monthEn = 'Feb';break;
				case 3: monthEn = 'Mar';break;
				case 4: monthEn = 'Apr';break;
				case 5: monthEn = 'May';break;
				case 6: monthEn = 'Jun';break;
				case 7: monthEn = 'Jul';break;
				case 8: monthEn = 'Aug';break;
				case 9: monthEn = 'Sep';break;
				case 10: monthEn = 'Oct';break;
				case 11: monthEn = 'Nov';break;
				case 12: monthEn = 'Dec';break;
			}
			return monthEn;
		};

		var winWidth = $(window).width();

		var today = new Date();
		var todayTime = formatDate(today.getDate()) + ' ' + formatMonth((today.getMonth() + 1));
		var startTimeStr = new Date(today.getTime() + 86400000 * 1);
		var startTimeInit =  startTimeStr.getFullYear()+ '-' +(startTimeStr.getMonth() + 1)+ '-' + formatDate(startTimeStr.getDate());
		var startTime = formatDate(startTimeStr.getDate()) + ' ' + formatMonth((startTimeStr.getMonth() + 1));
		var endTimeStr = new Date(today.getTime() + 86400000 * 2);
		var endTimeInit =  endTimeStr.getFullYear()+ '-' +(endTimeStr.getMonth() + 1)+ '-' + formatDate(endTimeStr.getDate());
		var endTime = formatDate(endTimeStr.getDate()) + ' ' + formatMonth((endTimeStr.getMonth() + 1));
		var maxTime = formatDate(today.getDate()) + ' ' + formatMonth((today.getMonth() + 1));

		// 初始化日期的值
		if (single) {
			$(id).attr('data-start',startTimeInit);
		} else {
			$(id).attr('data-start',startTimeInit);
			$(id).attr('data-end',endTimeInit);
		}

		// 酒店当天不可选
		var minDate = todayTime;
		if(showTotleDay){
			minDate=startTime;
		}
		
		var that = this;
		$(id).daterangepicker({
			parentEl:container,
			format: 'D MMM',
			startDate: startTime,
			endDate: endTime,
			minDate: minDate,
			// maxDate:'2018-06-02',
			singleDatePicker: single, //单日期
			showTotleDay: showTotleDay, //是否显示已经选择的天数
			showDateTitle: true,
			showDateTitle1:showDateTitle1,
			showDateTitle2:showDateTitle2,
			showDropdowns: false, //下拉选择月份和年份
			showWeekNumbers: false, //显示周
			autoApply: true, //自动关闭日期
			language :'en',
			},function(start, end, label) {//格式化日期显示框  
				if (this.singleDatePicker) {
					$(id).html(start.format('D MMM'));
					$(id).attr('data-start',start.format('YYYY-MM-DD'));
				} else {
					$(id).html(start.format('D MMM') + ' - ' + end.format('D MMM'));
					$(id).attr('data-start',start.format('YYYY-MM-DD')).attr('data-end',end.format('YYYY-MM-DD'));
				}

				// 操作外层box移动
				var moveBox = function(){
					if(showTotleDay){ //酒店
						box.css('left',493);
						if(id=='.js-thDate-result'){
							that.changeWidth('ticketHotel');
						}else{
							that.changeWidth('hotel');
						}

						dateBox.slideUp(function(){ //日期地隐藏
							peopleBox.slideDown(); //人数显示
						}); 
						
						setTimeout(function(){
							box.addClass('hotelPeople-popup-box'); //移动before小箭头
						},600);
					}else if(id=='.js-thDate-result'){ // 机票+酒店
						if(winWidth>1200){
							box.css('left',1020);
						}else if(winWidth<=1200){
							box.css({'top':-10,'left':320});
						}
					}else{ // 机票
						/*if(peopleBox!=='0'){
							box.css('left',730);
							setTimeout(function(){
								box.addClass('ticket-popup-box'); //移动before小箭头
							},600);
						}*/
					} 
					if(peopleBox!=='0'){
						dateBox.slideUp(function(){ //日期地隐藏
							// peopleBox.slideDown(); //人数显示
						}); 
					}else{
						$('.js-fStatusPopup-content').removeClass('popup-active').addClass('popup-inactive'); 
						$('.js-fStatusPopup-box').removeClass('popup-box-before'); //隐藏小箭头
					}
				}

				// 操作外层box移动
				if (this.singleDatePicker) {
					moveBox();
				}else{
					setTimeout(moveBox,600);
				}
			} 
		);

		// 隐藏日期的apply和cancel按钮
		$('.js-date-ok').hide();
	},

	/* 简洁日期选择 */
	simpleDate:function(single,singleCal,id,container){
		// 日期选择
		var formatDate = function(num) { //日期格式化
			return num < 10 ? (num = '0' + num) : num;
		};

		var formatMonth = function(month){
			var monthEn;
			switch (month) {
				case 1: monthEn = 'Jan';break;
				case 2: monthEn = 'Feb';break;
				case 3: monthEn = 'Mar';break;
				case 4: monthEn = 'Apr';break;
				case 5: monthEn = 'May';break;
				case 6: monthEn = 'Jun';break;
				case 7: monthEn = 'Jul';break;
				case 8: monthEn = 'Aug';break;
				case 9: monthEn = 'Sep';break;
				case 10: monthEn = 'Oct';break;
				case 11: monthEn = 'Nov';break;
				case 12: monthEn = 'Dec';break;
			}
			return monthEn;
		};

		var winWidth = $(window).width();

		var today = new Date();
		var todayTime = formatDate(today.getDate()) + ' ' + formatMonth((today.getMonth() + 1));
		var startTimeStr = new Date(today.getTime() + 86400000 * 1);
		var startTimeInit =  startTimeStr.getFullYear()+ '-' +(startTimeStr.getMonth() + 1)+ '-' + formatDate(startTimeStr.getDate());
		var startTime = formatDate(startTimeStr.getDate()) + ' ' + formatMonth((startTimeStr.getMonth() + 1));
		var endTimeStr = new Date(today.getTime() + 86400000 * 2);
		var endTimeInit =  endTimeStr.getFullYear()+ '-' +(endTimeStr.getMonth() + 1)+ '-' + formatDate(endTimeStr.getDate());
		var endTime = formatDate(endTimeStr.getDate()) + ' ' + formatMonth((endTimeStr.getMonth() + 1));
		var maxTime = formatDate(today.getDate()) + ' ' + formatMonth((today.getMonth() + 1));

		// 初始化日期的值
		if (single) {
			$(id).attr('data-start',startTimeInit);
		} else {
			$(id).attr('data-start',startTimeInit);
			$(id).attr('data-end',endTimeInit);
		}
		
		var that = this;
		$(id).daterangepicker({
			parentEl:container,
			format: 'D MMM',
			startDate: startTime,
			endDate: endTime,
			minDate: todayTime,
			// maxDate:'2018-06-02',
		    singleDatePicker: single, //单日期
		    singleDatePicker_2: singleCal, //单日期单日历
		    showDateTitle: false,
		    showDropdowns: false, //下拉选择月份和年份
		    showWeekNumbers: false, //显示周
		    autoApply: true, //自动关闭日期
		    language :'en',
			},function(start, end, label) {//格式化日期显示框  
				if (this.singleDatePicker) {
					$(id).html(start.format('D MMM'));
					$(id).attr('data-start',start.format('YYYY-MM-DD'));
				} else {
					$(id).html(start.format('D MMM') + ' - ' + end.format('D MMM'));
					$(id).attr('data-start',start.format('YYYY-MM-DD')).attr('data-end',end.format('YYYY-MM-DD'));
				}
			}
		);

		// 隐藏日期的apply和cancel按钮
		$('.js-date-ok').hide();
	},

	/* 移动端日期选择 */
	mDateSelect:function(single,id,container,showTotleDay){
		// 日期选择
		var formatDate = function(num) { //日期格式化
			return num < 10 ? (num = '0' + num) : num;
		};

		var formatMonth = function(month){
			var monthEn;
			switch (month) {
				case 1: monthEn = 'Jan';break;
				case 2: monthEn = 'Feb';break;
				case 3: monthEn = 'Mar';break;
				case 4: monthEn = 'Apr';break;
				case 5: monthEn = 'May';break;
				case 6: monthEn = 'Jun';break;
				case 7: monthEn = 'Jul';break;
				case 8: monthEn = 'Aug';break;
				case 9: monthEn = 'Sep';break;
				case 10: monthEn = 'Oct';break;
				case 11: monthEn = 'Nov';break;
				case 12: monthEn = 'Dec';break;
			}
			return monthEn;
		};

		var winWidth = $(window).width();

		var today = new Date();
		var todayTime = formatDate(today.getDate()) + ' ' + formatMonth((today.getMonth() + 1));
		var startTimeStr = new Date(today.getTime() + 86400000 * 1);
		var startTimeInit =  startTimeStr.getFullYear()+ '-' +(startTimeStr.getMonth() + 1)+ '-' + formatDate(startTimeStr.getDate());
		var startTime = formatDate(startTimeStr.getDate()) + ' ' + formatMonth((startTimeStr.getMonth() + 1));
		var endTimeStr = new Date(today.getTime() + 86400000 * 2);
		var endTimeInit =  endTimeStr.getFullYear()+ '-' +(endTimeStr.getMonth() + 1)+ '-' + formatDate(endTimeStr.getDate());
		var endTime = formatDate(endTimeStr.getDate()) + ' ' + formatMonth((endTimeStr.getMonth() + 1));
		var maxTime = formatDate(today.getDate()) + ' ' + formatMonth((today.getMonth() + 1));

		// 初始化日期的值
		if (single) {
			$(id).attr('data-start',startTimeInit);
		} else {
			$(id).attr('data-start',startTimeInit);
			$(id).attr('data-end',endTimeInit);
		}

		// 酒店当天不可选
		var minDate = todayTime;
		if(showTotleDay){
			minDate=startTime;
		}
		
		var that = this;
		$(id).daterangepicker({
			parentEl:container,
			format: 'D MMM',
			startDate: startTime,
			endDate: endTime,
			minDate: minDate,
			// maxDate:'2018-06-02',
			singleDatePicker: single, //单日期
			showTotleDay: showTotleDay, //是否显示已经选择的天数
			showDateTitle: false,
			showDropdowns: false, //下拉选择月份和年份
			showWeekNumbers: false, //显示周
			autoApply: true, //自动关闭日期
			language :'en',
			},function(start, end, label) {//格式化日期显示框  
				if (this.singleDatePicker) {
					$(id).html(start.format('D MMM'));
					$(id).attr('data-start',start.format('YYYY-MM-DD'));
				} else {
					$(id).html(start.format('D MMM') + ' - ' + end.format('D MMM'));
					$(id).attr('data-start',start.format('YYYY-MM-DD')).attr('data-end',end.format('YYYY-MM-DD'));
				}

				setTimeout(function(){
				    $('.popup-container').removeClass('is-show');
				    $('html,body').removeClass('ovfHiden'); //使网页可滚动
				},600);
			}
		);

		// 隐藏酒店日期范围
		$('.js-range-date').hide();

		// 点击OK的时候关闭弹出框
		$('.js-applyBtn').click(function(event) {
			$('.js-popup-container').removeClass('is-show');
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		});
	},

	/* 模糊匹配 */
	autoComplete:function(id){
		var that = this;
		/* 机票模糊匹配 */
		$(id).on('input',function(event) {
			var searchText = $(this).val();
			var currenData;
			var data = $(this).attr('data');

			if(data=='js-fNumber-menu'){
				currenData=that.fNumberData
			}else{
				// 机票
				currenData = that.fromToAuto(id);

				// 机+酒
				if(id=='.js-thFrom-input'){
					currenData = that.thFromCityData;
				}
				if(id=='.js-thTo-input'){
					currenData = that.thToCityData;
				}
			}

			var currentVal = searchText.toLowerCase();
			var srdata = [];
			for (var i = 0; i < currenData.length; i++) {
				if (currentVal.trim().length > 0 && currenData[i].toLowerCase().indexOf(currentVal) > -1) {
					srdata.push(currenData[i]);
				}
			}

			$('.'+data).empty();
			var escapedSearchText,zregex,startpos,text,searchVal;
			$.each(srdata,function(i,val){
				escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				zregex = new RegExp(escapedSearchText, 'i');
				startpos = val.search(zregex);
				text = val.substr(0, startpos + searchText.length) + '</span>' + val.substr(startpos + searchText.length);
				searchVal = text.substr(0, startpos) + '<span>' + text.substr(startpos);

				$('.'+data).append('<li title="'+val+'">'+searchVal+'</li>');
			});
			if(srdata.length==0){ 
				$('.'+data).append('<p style="width:100%;">No results match "'+searchText+'"</p>');
			}
			if(currentVal===''){
				$('.'+data).empty();
				$.each(currenData,function(i,val){
					$('.'+data).append('<li title="'+val+'">'+val+'</li>');
				});
			}
		});
	},

	/* 出发地和目的地匹配 */
	fromToAuto:function(id){
		var that = this;
		var currenData;
		var searchVal = $('.js-city-search').attr('data');
		if(((id=='.js-from-input' || searchVal=='js-from-menu') && $('.js-to-input').val()=='') || ((id=='.js-to-input' || searchVal=='js-to-menu') && $('.js-from-input').val()=='')){
			currenData = that.cityData;
		}
		var fromVal = $.trim($('.js-from-input').attr('data-city'));
		var toVal = $.trim($('.js-to-input').attr('data-city'));
		if((id=='.js-from-input' || searchVal=='js-from-menu')){
			currenData = that.cityData
		}else if((id=='.js-to-input' || searchVal=='js-to-menu') && $('.js-from-input').val()!='' && that.cityDataAuto[fromVal]!=undefined){
			currenData = that.cityDataAuto[fromVal]
		}else if(that.cityDataAuto[fromVal]==undefined || that.cityDataAuto[toVal]==undefined){
			currenData = [];
		}
		return currenData;
	},

	/* 键盘事件 */
	keyEvent:function(input,ul,indexLi){
		var that = this;
		var $box = $('.js-popup-box'); //c3动画最外层
		var $fromBox = $('.js-airport-from'); //出发地外层
		var $dateBox = $('.js-popup-date'); //日期外层
		var $toBox = $('.js-airport-to'); //目的地外层
		var $fromInput = $('.js-from-input'); //机票出发地
		var $toInput = $('.js-to-input'); //机票目的地
		var $toMenuSub = $('.js-to-menu'); //目的地下拉菜单

		// 机+酒
		var $thFromInput = $('.js-thFrom-input'); 
		var $thToInput = $('.js-thTo-input'); 
		var $thBox = $('.js-thPopup-box'); 
		var $thFromBox = $('.js-thAirport-from'); 
		var $thToBox = $('.js-thAirport-to'); 
		var $thDateBox = $('.js-thPopup-date'); 
		var $thToMenuSub = $('.js-thTo-menu'); 

		var $routeFromInput = $('.js-routeFrom-input'); //航班动态出发地
		var $routeToInput = $('.js-routeTo-input'); //航班动态查询目的地
		var $fStatusBox = $('.js-fStatusPopup-box'); //航班动态c3动画最外层
		var $routeFromBox = $('.js-routeBox-from'); //航班动态出发地外层
		var $routeToBox = $('.js-routeBox-to'); //航班动态目的地外层
		var $routeDateBox = $('.js-routePopup-date'); //航班动态日期外层
		var $routeToMenuSub = $('.js-routeTo-menu'); //航班号下拉菜单 --- 航班动态

		/* 设置目的地下拉的值 */
		var toCityVal = function(text){
			var tocityArr = that.fromToAuto('.js-to-input');
			$toMenuSub.empty();
			$toInput.val('');
			if(tocityArr.length == 0){
				$toMenuSub.html('<p style="width:100%;">No matching flights!</p>');
			}
			$.each(tocityArr,function(i,val){
				$toMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});	
			$('.js-to-menu>li:first').addClass('active');		
		};

		var thToCityVal = function(text){
			var tocityArr = that.thToCityData;
			$thToMenuSub.empty();
			$.each(tocityArr,function(i,val){
				$thToMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});	
			$('.js-thTo-menu>li:first').addClass('active');		
		};

		var routeToCityVal = function(text){
			var tocityArr = that.cityData;
			$routeToMenuSub.empty();
			$.each(tocityArr,function(i,val){
				$routeToMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});	
			$('.js-routeTo-menu>li:first').addClass('active');		
		};

		/* 获取屏幕尺寸 */
		var winWidth = $(window).width();

		/* 键盘上下选择城市 */
		var keyDown = function(input,ul,indexLi){
			var $input = $(input);

			// 定义UL下拉菜单
			var $fUl = $(ul);

			function keychang(up){
				if(up == "up"){ //向上
					if(indexLi == 0){
						indexLi = $fUl.children().length-1;
					}else{
						indexLi--;
					}
				}else{//向下
					if(indexLi ==  $fUl.children().length-1){
						indexLi = 0;
					}else{
						indexLi++;
					}
				}
				$fUl.children('li').eq(indexLi).addClass("active").siblings('li').removeClass('active');		
			}

			//按键盘的上下移动LI的背景色
			$input.keydown(function(event){
				if(event.which == 38){//向上
					event.preventDefault();
					keychang("up");
				}else if(event.which == 40){//向下
					keychang();
				}else if(event.which == 13){ //回车

					var text1 = $fUl.children().eq(indexLi).attr('title');
					if(text1!==undefined){
						var text2 = text1.split('/');
					}else{
						return;
					}
					if(input=='.js-from-input'){
						$fromInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1); //出发地赋值
						toCityVal(text1); //下拉菜单赋值筛选

						if(winWidth>1200){
							$box.css('left',350);
						}else if(winWidth<=1200){
							$box.css({'top':-88,'left':350});
						}
						$toInput.select();
						$('.js-to-menu>li:first').addClass('active');

						$fromBox.slideUp(function(){ //出发地隐藏
							$toBox.slideDown(); //目的地显示
						}); 
					}else if(input=='.js-to-input'){
						$toInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1);
						if(winWidth>1200){
							$box.css('left',700);
						}else if(winWidth<=1200){
							$box.css({'top':-10,'left':0});
						}
						$toBox.slideUp(function(){ //出发地隐藏
							$('.js-date-result').click(); //日期展示
							$dateBox.slideDown(); //目的地显示
						}); 
					}else if(input=='.js-fNumber-input'){
						$('.js-fNumber-input').val(text1);
						$box.css('left',350);
						$('.js-fNumBox-from').slideUp(function(){ 
							$('.js-numDate-result').click(); //日期展示
							$('.js-numPopup-date').slideDown(); 
						}); 
					}else if(input=='.js-routeFrom-input'){
						$routeFromInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1); //出发地赋值
						routeToCityVal(text1); //下拉菜单赋值筛选

						if(winWidth>1200){
							$fStatusBox.css('left',350);
						}else if(winWidth<=1200){
							$fStatusBox.css({'top':-90,'left':350});
						}

						$routeToInput.focus();
						$('.js-to-menu>li:first').addClass('active');

						$routeFromBox.slideUp(function(){ //酒店出发地隐藏
							$routeToBox.slideDown(); //酒店日期显示
						}); 

					}else if(input=='.js-routeTo-input'){
						$routeToInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1);

						if(winWidth>1200){
							$fStatusBox.css('left',700);
						}else if(winWidth<=1200){
							$fStatusBox.css({'top':-10,'left':0});
						}
						$routeToBox.slideUp(function(){ //航班动态目的地隐藏
							$('.js-routeDate-result').click(); //日期展示
							$routeDateBox.slideDown(); //酒店日期显示
						}); 
					}else if(input=='.js-thFrom-input'){
						$thFromInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1); //出发地赋值
						thToCityVal(text1); //下拉菜单赋值筛选

						if(winWidth>1200){
							$thBox.css('left',350);
						}else if(winWidth<=1200){
							$thBox.css({'top':-90,'left':350});
						}

						$thToInput.focus();
						$('.js-thTo-menu>li:first').addClass('active');

						$thFromBox.slideUp(function(){ //酒店出发地隐藏
							$thToBox.slideDown(); //酒店日期显示
						}); 

					}else if(input=='.js-thTo-input'){
						$thToInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1);

						if(winWidth>1200){
							$thBox.css('left',700);
						}else if(winWidth<=1200){
							$thBox.css({'top':-10,'left':0});
						}
						$thToBox.slideUp(function(){ //航班动态目的地隐藏
							$('.js-thDate-result').click(); //日期展示
							$thDateBox.slideDown(); //酒店日期显示
						}); 
					}
				}
			});	
		};
		keyDown(input,ul,indexLi);
	},

	/* 机票选择 */
	ticketSelect:function(){
		/* 最外层div */
		var $box = $('.js-popup-box'); //c3动画最外层
		var $content = $('.js-popup-content'); //c3动画内容
		
		// 输入框
		var $fromInput = $('.js-from-input'); //机票出发地
		var $toInput = $('.js-to-input'); //机票目的地
		var $date = $('.js-date-result'); //机票日期
		var $people = $('.js-ticket-people'); //机票人数

		// 下拉菜单
		var $fromMenuSub = $('.js-from-menu'); //机票出发地下拉菜单
		var $toMenuSub = $('.js-to-menu'); //目的地下拉菜单
		var $ticketChange = $('.js-ticket-change'); //切换机票出发地和目的地

		// 下拉菜单外层
		var $fromBox = $('.js-airport-from'); //出发地外层
		var $toBox = $('.js-airport-to'); //目的地外层
		var $dateBox = $('.js-popup-date'); //日期外层
		var $peopleBox = $('.js-popup-people'); //人数选择外层
		
		// 初始化
		$fromInput.val('Phnom Penh/PNH').attr('data-city','Phnom Penh/PNH/Cambodia');
		$toInput.val('HongKong/HKG').attr('data-city','HongKong/HKG/HongKong,China');

		/* c3动画 */
		var popupShow = function(){
			$ticketChange.show(); //显示出发地和目的地切换
			$box.addClass('popup-box-before'); //展示小箭头
			$content.removeClass('popup-inactive').addClass('popup-active'); 
		};
		var popupHide = function(){
			$content.removeClass('popup-active').addClass('popup-inactive'); 
			$box.removeClass('popup-box-before'); //隐藏小箭头
		};
		
		/* 日期选择 */
		var that = this;
		this.dateSelect(true,'.js-date-result','.js-popup-date',false,$box,$dateBox,$peopleBox,'Choose your departure date :','Choose your return date :');
		
		/* 单程往返切换 */
		$('.js-ticket-radio label').click(function(e){
			e.stopPropagation();
			$(this).children('i').addClass('active').parent().siblings('label').children('i').removeClass('active');
			var selectWay = $(this).children('span').attr('data-way');
			switch (selectWay) {
				case 'round':
					that.dateSelect(false,'.js-date-result','.js-popup-date',false,$box,$dateBox,$peopleBox,'Choose your departure date :','Choose your return date :');
					$('.js-date-result').click(); //日期展示
					$('#tripType').val('RT');
					break;
					case 'one':
					that.dateSelect(true,'.js-date-result','.js-popup-date',false,$box,$dateBox,$peopleBox,'Choose your departure date :','Choose your return date :');
					$('.js-date-result').click(); //日期展示
					$('#tripType').val('OW');
				break;
			}
		});

		/* 出发地和目的地切换 */
		$ticketChange.click(function(event) {
			var fVal = $fromInput.val();
			var fDataVal = $fromInput.attr('data-city');
			var tVal = $toInput.val();
			var tDataVal = $toInput.attr('data-city');

			$fromInput.val(tVal);
			$fromInput.attr('data-city',tDataVal);
			$toInput.val(fVal);
			$toInput.attr('data-city',fDataVal);
		});

		/* 设置出发地下拉的值 */
		var fromCityVal = function(text){ 
			var fromcityArr = that.fromToAuto('.js-from-input');
			$fromMenuSub.empty();
			$.each(fromcityArr,function(i,val){
				$fromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			$('.js-from-menu>li:first').addClass('active');
		};

		/* 设置目的地下拉的值 */
		var toCityVal = function(text){
			var tocityArr = that.fromToAuto('.js-to-input');
			$toMenuSub.empty();
			$toInput.val('');
			if(tocityArr.length == 0){
				$toMenuSub.html('<p style="width:100%;">No matching flights!</p>');
			}
			$.each(tocityArr,function(i,val){
				$toMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});	
			$('.js-to-menu>li:first').addClass('active');		
		};

		/* 点击机票出发地 */
		$ticketChange.show(); //显示出发地和目的地切换
		$fromInput.click(function(e){
			e.stopPropagation();
			fromCityVal($toInput.attr('data-city')); //下拉菜单赋值
			$(this).select();
			$box.css('left',0);
			popupShow(); //增加c3动画
			$box.removeClass('ticket-popup-box'); //移动before小箭头
			$fromBox.show();
			$toBox.hide(); $dateBox.hide(); $peopleBox.hide();
		});

		/* 点击机票目的地 */
		$toInput.click(function(e){
			e.stopPropagation();
			toCityVal($fromInput.attr('data-city')); //下拉菜单赋值
			$(this).select();
			$box.css('left',310);
			popupShow(); //增加c3动画
			$box.removeClass('ticket-popup-box'); //移动before小箭头
			$toBox.show();
			$fromBox.hide(); $dateBox.hide(); $peopleBox.hide();
		});

		/* 点击机票日期 */
		$date.click(function(e) {
			e.stopPropagation();
			$box.css('left',592);
			popupShow(); //增加c3动画
			$box.removeClass('ticket-popup-box'); //移动before小箭头
			$dateBox.show();
			$fromBox.hide(); $toBox.hide(); $peopleBox.hide();
		});

		/* 点击机票人数 */
		$people.click(function(e) {
			e.stopPropagation();
			$box.css('left',730);
			popupShow(); //增加c3动画
			$box.addClass('ticket-popup-box'); //移动before小箭头
			$peopleBox.show();
			$fromBox.hide(); $toBox.hide(); $dateBox.hide();
		});

		/* 点击空白处隐藏下拉框 */
		$('html').click(function(){
			popupHide(); //隐藏弹出内容层
		});
		/* 阻止冒泡 */
		$dateBox.click(function(e){
			e.stopPropagation();
		});
		$peopleBox.click(function(e){
			e.stopPropagation();
		});

		/* 删除数组中某个元素 */
		Array.prototype.indexOf = function (val) {
			for(var i = 0; i < this.length; i++){
				if(this[i] == val){return i;}
			}
			return -1;
		};
		Array.prototype.remove = function (val) {
			var index = this.indexOf(val);
			if(index > -1){this.splice(index,1);}
		};

		/* 机票出发地选择 */
		$fromMenuSub.on('click','>li',function(e){
			e.stopPropagation();
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$fromInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1); //出发地赋值
			toCityVal(text1); //下拉菜单赋值筛选

			$box.css('left',310);

			$toInput.select();
			$('.js-to-menu>li:first').addClass('active');

			$fromBox.slideUp(function(){ //出发地隐藏
				$toBox.slideDown(); //目的地显示
			}); 
		});

		/* 机票目的地选择 */
		$toMenuSub.on('click','>li',function(e){
			e.stopPropagation();
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$toInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1);
			$box.css('left',580);
			$toBox.slideUp(function(){ //出发地隐藏
				$('.js-date-result').click(); //日期展示
				$dateBox.slideDown(); //目的地显示
			}); 
		});

		// 模糊匹配
		this.autoComplete('.js-from-input');
		this.autoComplete('.js-to-input');

		// 键盘事件
		this.keyEvent('.js-from-input','.js-from-menu',that.indexLiFrom);
		this.keyEvent('.js-to-input','.js-to-menu',that.indexLiTo); 

		/* 机票搜索 --- 按钮点击 */
		$('.js-ticket-search').click(function () {
			var tripType = $('#tripType').val();
			var orgcity = $('#orgcity').val();
			var dstcity = $('#dstcity').val();
			var takeoffDate = $('#takeoffDate').val();
			var returnDate = $('#returnDate').val();

	    var adultNum = $('.js-ticket-content .js-p-adult>span').text();
	    var childNum = $('.js-ticket-content .js-p-child>span').text();
	    var infantNum = $('.js-ticket-content .js-p-infant>span').text();

	    var startDate = $('.js-date-result').attr('data-start');
	    var endDate = $('.js-date-result').attr('data-end');
	    var orgCity = ($('.js-from-input').val()).substring(($('.js-from-input').val()).indexOf('/') + 1);
	    var dstCity = ($('.js-to-input').val()).substring(($('.js-to-input').val()).indexOf('/') + 1);

	    $('#adultCount').val(adultNum);
	    $('#childCount').val(childNum);
	    $('#infantCount').val(infantNum);

	    $('#takeoffDate').val(startDate);
	    $('#returnDate').val(endDate);

	    $('#orgcity').val(orgCity);
	    $('#dstcity').val(dstCity);
	    // console.log(adultNum);
	    $('#air-ticket-form').submit(); 
	    /*var data = {tripType:tripType,cabinType:'ECONOMY',orgcity:orgCity,dstcity:dstCity,takeoffDate:takeoffDate,returnDate:returnDate,adultCount:adultNum,childCount:childNum,language:'CN',CURRENCY:'CNY'};
	    window.open('http://b2c.lanmeiairlines.com/lqWeb/reservation/AVQuery.do?tripType=RT&cabinType=ECONOMY&orgcity=CAN&dstcity=PNH&takeoffDate=2018-8-02&returnDate=2018-8-03&adultCount=1&childCount=0&language=CN&CURRENCY=CNY');
	    $.ajax({
				url:"http://b2c.lanmeiairlines.com/lqWeb/reservation/AVQuery.do",
				type:"get",
				data:data,
				success:function(data){
						
				},
				error:function(e){
						
				}
			});*/
		});
	},

	/* 快捷机票查询 */
	quickTicket:function(){
		// 日期选择--动态加载
		var formatDate = function(ymd) { //日期格式化
		    return ymd.replace(/(\d{4})\-(\d{1,2})\-(\d{1,2})/g, function(ymdFormatDate, y, m, d){
		        m < 10 && (m = '0' + m);
		        d < 10 && (d = '0' + d);
		        return y + '-' + m + '-' + d;
		    });
		};
		var today  = new Date();
		var startTimeStr = new Date(today.getTime()+86400000*1); 
		// var endTimeStr = new Date(today.getTime()+86400000*2); 
		var startTime = formatDate(startTimeStr.getFullYear()+'-'+(startTimeStr.getMonth()+1)+'-'+startTimeStr.getDate());
		// var endTime = formatDate(endTimeStr.getFullYear()+'-'+(endTimeStr.getMonth()+1)+'-'+endTimeStr.getDate());

		$('.js-ticket-inquiry').click(function(event) {
			event.preventDefault();
			$('#quick-orgcity').val($(this).attr('data-from'));
			$('#quick-dstcity').val($(this).attr('data-to'));
			$('#quick-takeoffDate').val(startTime);
			$('#quick-ticket-form').submit();
		});
	},

	/* 移动端机票选择 */
	mTicketSelect:function(){
		var that = this;

		// 最外层容器
		var $container = $('.js-popup-container');
		var $box = $('.js-popup-box');

		// 关闭容器按钮
		var $close = $('.js-popup-close');

		// 出发地和目的地外层
		var $cityFrom = $('.js-ticket-from');
		var $cityTo = $('.js-ticket-to');

		// 输入框
		var $fromInput = $('.js-from-input'); //机票出发地
		var $fromSpan = $('.js-m-Fcity');
		var $toInput = $('.js-to-input'); //机票目的地
		var $toSpan = $('.js-m-Tcity');
		var $date = $('.js-date-result'); //机票日期
		var $people = $('.js-ticket-people'); //机票人数

		var $searchInput = $('.js-city-search'); //模糊搜索框
		var $searchTitle = $('.js-popup-title'); //标题

		// 下拉菜单
		var $fromMenuSub = $('.js-from-menu'); //机票出发地下拉菜单
		var $toMenuSub = $('.js-to-menu'); //目的地下拉菜单
		var $ticketChange = $('.js-ticket-change'); //切换机票出发地和目的地

		var winHeight = $(window).height();

		var hideContainer = function(){
			$container.removeClass('is-show');
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		};
		var ovfHiden = function(){
			$('html,body').addClass('ovfHiden'); //使网页不可滚动
		};

		// 初始化
		function setInitVal(text1,$input,$span){
			var text2 = text1.split('/');
			$input.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$span.text(text2[0]+'/'+text2[2]);
		}
		setInitVal('Phnom Penh/PNH/Cambodia',$fromInput,$fromSpan);
		setInitVal('Guangzhou/CAN/China',$toInput,$toSpan);

		// 关闭弹出框
		$close.click(function(event) {
			hideContainer();
		});

		// 点击出发地
		$cityFrom.click(function(event) {
			$fromMenuSub.empty();
			$('.js-popup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-airport-from').show();
			$searchInput.show().attr('data','js-from-menu').val('');

			var toVal = $toInput.attr('data-city'); //获取目的地的值进行过滤
			$.each(that.fromToAuto('.js-from-input'),function(i,val){
				$fromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			// $fromMenuSub.children('li:contains('+toVal+')').remove(); //过滤

			ovfHiden(); //使网页不可滚动
			$box.height(winHeight-98);
			$searchTitle.html('Select origin');

			$container.addClass('is-show');
		});

		// 机票出发地选择 
		$fromMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$fromInput.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$fromSpan.text(text2[0]+'/'+text2[2]);
			// 清除目的地的值
			$toInput.val('');
			$toSpan.text('');
			
			hideContainer();
		});

		// 点击目的地
		$cityTo.click(function(event) {
			$toMenuSub.empty();
			$('.js-popup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-airport-to').show();
			$searchInput.show().attr('data','js-to-menu').val('');

			var fromVal = $fromInput.attr('data-city'); //获取出发地的值进行过滤
			var tocityArr = that.fromToAuto('.js-to-input');
			if(tocityArr.length == 0){
				$toMenuSub.html('<p style="width:100%;">No matching flights!</p>');
			}
			$.each(tocityArr,function(i,val){
				$toMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});

			// $toMenuSub.children('li:contains('+fromVal+')').remove(); //过滤

			ovfHiden(); //使网页不可滚动
			$box.height(winHeight-98);
			$searchTitle.html('Select destination');

			$container.addClass('is-show');
		});

		// 机票目的地选择 
		$toMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$toInput.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$toSpan.text(text2[0]+'/'+text2[2]);
			hideContainer();
		});

		// 出发地和目的地切换
		$('.js-mTicket-change').click(function(event) {
			var fVal = $fromInput.val();
			var fSpan = $fromSpan.text();
			var tVal = $toInput.val();
			var tSpan = $toSpan.text();
			$fromInput.val(tVal); $fromSpan.text(tSpan);
			$toInput.val(fVal); $toSpan.text(fSpan);
		});

		// 模糊匹配
		this.autoComplete('.js-city-search');

		// 日期选择
		this.mDateSelect(true,'.js-date-result','.js-popup-date',false);
		$date.click(function(event) {
			$('.js-popup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-popup-date').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select dates');
			$box.height(winHeight-58);

			$container.addClass('is-show');
		});

		// 单程往返切换 
		$('.js-select-way>a').click(function(event) {
			event.stopPropagation();
			$(this).addClass('active').siblings('a').removeClass('active');
			var data = $(this).attr('data-way');
			switch (data) {
				case 'round':
					that.mDateSelect(false,'.js-date-result','.js-popup-date',false);
					break;
					case 'one':
					that.mDateSelect(true,'.js-date-result','.js-popup-date',false);
					break;
				}
			});

		// 人数选择
		$people.click(function(e) {
			e.stopPropagation();
			$('.js-popup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-popup-people').show();
			ovfHiden(); //使网页不可滚动
			$searchInput.hide();
			$searchTitle.text('Select people');
			$box.height(winHeight-58);
			$container.addClass('is-show');
		});
		// 确认人数选择
		$('.js-mSelect-people').click(function(event) {
			hideContainer();
		});
	},

	/* 酒店选择 */
	hotelSelect:function(){
		var $hotelBox = $('.js-hotelPopup-box'); //酒店c3动画最外层
		var $hotelContent = $('.js-hotelPopup-content'); //酒店c3动画内容

		/* 输入框 */
		var $hotelFromInput = $('.js-hotelFrom-input'); //酒店出发地
		var $hotelDate = $('.js-hotelDate-result'); //酒店日期
		var $hotelPeople = $('.js-hotel-people'); //酒店人数

		/* 下拉菜单 */
		var $hotelFromMenuSub = $('.js-hotelFrom-menu'); //酒店出发地下拉菜单

		/* 下拉菜单外层 */
		var $hotelFromBox = $('.js-hotelPopup-from'); //酒店出发地外层
		var $hotelDateBox = $('.js-hotelPopup-date'); //酒店日期外层
		var $hotelPeopleBox = $('.js-hotelPopup-people'); //酒店人数选择外层

		/* 点击第一个div,然后显示其他div  */
		var $hotelZoom = $('.js-hotel-date,.js-hotel-people,.js-hotel-cancel,.js-hotel-search');

		/* css3动画 */
		var hotelPopupShow = function(){
			$hotelBox.addClass('popup-box-before'); //展示小箭头
			$hotelContent.removeClass('popup-inactive').addClass('popup-active'); 
		};
		var hotelPopupHide = function(){
			$hotelContent.removeClass('popup-active').addClass('popup-inactive'); 
			$hotelBox.removeClass('popup-box-before'); //隐藏小箭头
		};

		/* 日期选择 */
		this.dateSelect(false,'.js-hotelDate-result','.js-hotelPopup-date',true,$hotelBox,$hotelDateBox,$hotelPeopleBox,'Choose your check in time :','Choose your check out time:');

		/* 点击酒店出发地 */
		$hotelFromInput.click(function(e){
			e.stopPropagation();
			$hotelContent.css('left',0); //重置人数选择后的位移
			$hotelBox.css('left',0);
			hotelPopupShow(); //增加c3动画
			$hotelBox.removeClass('hotelPeople-popup-box'); //移动before小箭头
			$hotelFromBox.show();
			$hotelDateBox.hide(); $hotelPeopleBox.hide();
		});

		/* 点击酒店日期 */
		$hotelDate.click(function(e) {
			e.stopPropagation();
			$hotelContent.css('left',0); //重置人数选择后的位移
			$hotelBox.css('left',372);
			hotelPopupShow(); //增加c3动画
			$hotelBox.removeClass('hotelPeople-popup-box'); //移动before小箭头
			$hotelDateBox.show();
			$hotelFromBox.hide(); $hotelPeopleBox.hide();
		});

		/* 点击酒店人数 */
		var $that = this;
		$hotelPeople.click(function(e) {
			e.stopPropagation();
			$hotelContent.css('left',0); //重置人数选择后的位移
			$hotelBox.css('left',493);
			hotelPopupShow(); //增加c3动画
			$that.changeWidth('hotel');
			$hotelBox.addClass('hotelPeople-popup-box'); //移动before小箭头
			$hotelPeopleBox.show();
			$hotelFromBox.hide(); $hotelDateBox.hide();
		});

		$('html').click(function(){
			hotelPopupHide(); //隐藏弹出内容层
		});
		/* 阻止冒泡 */
		$hotelDateBox.click(function(e){
			e.stopPropagation();
		});
		$hotelPeopleBox.click(function(e){
			e.stopPropagation();
		});

		/* 酒店出发地选择 */
		$hotelFromMenuSub.on('click','>li',function(){
			var text = $(this).attr('title');
			$hotelFromInput.val(text);
			$hotelContent.css('left',0); //重置人数选择后的位移
			$hotelBox.css('left',372);
			$hotelFromBox.slideUp(function(){ //酒店出发地隐藏
				$('.js-hotelDate-result').click(); //日期展示
				$hotelDateBox.slideDown(); //酒店日期显示
			}); 
		});

		$('.js-hotelFrom-input').keyup(function () { // 搜索酒店
		    var term = $('.js-hotelFrom-input').val();
		    $('.js-hotelFrom-menu').html('<li>Loading...</li>');
		    $.ajax({
		        url: "http://hotels.lanmeiairlines.com/soap/auto-complete-general",
		        dataType: 'json',
		        data: {
		            term: term,
		        },
		        success: function (data) {
		            var str = '';
		            for (var i = 0; i < data.length; i++) {
		                str += '<li title="' + data[i].value + '"data-cate ="' + data[i].cate + '" data-id ="' + data[i].id + '">' + data[i].value + '</li>';
		            }
		            $('.js-hotelFrom-menu').html(str);
		        }
		    });
		});

		/* 酒店查询 */
		$('.js-hotel-search').click(function () {
		    var txtHotelID = $('.js-hotelFrom-input').val();
		    var dataCate = $('.js-hotelFrom-input').attr('data-cate');
		    var dataId = $('.js-hotelFrom-input').attr('data-id');
		    var startDate = $('.js-hotelDate-result').attr('data-start');
		    var endDate = $('.js-hotelDate-result').attr('data-end');
		    var roonsNum = $('.js-p-hotelRooms>span').text();

		    for (var i = 1; i <= roonsNum; i++) {
		        // 各个房间的成人数
		        var adultNum = $('.s-room-' + i + ' .js-hotelAdult-num').text();
		        $('#number_of_adults_' + i).val(adultNum);
		        // 各个房间的儿童数
		        var childNum = $('.s-room-' + i + ' .js-hotelChild-num').text();
		        $('#number_of_children_' + i).val(childNum);
		        // 各个房间的儿童年龄
		        for (var j = 1; j <= childNum; j++) {
		            var childAge = $('.s-room-' + i + ' .js-age-' + j + ' .js-age-result').text();
		            $('#child_age_' + i + '_' + j).val(childAge);
		        }
		    }

		    $('#txtHotelID').val(txtHotelID);
		    $('#data-cate').val(dataCate);
		    $('#data-id').val(dataId);
		    $('#datefrom').val(startDate);
		    $('#dateto').val(endDate);
		    $('#cboRoom').val(roonsNum);

		    $('#air-hotel-form').submit();
		});
	},

	/* 移动端酒店选择 */
	mHotelSelect:function(){
		var that = this;
		var $container = $('.js-popup-container');
		var $hotelBox = $('.js-hotelPopup-box'); //酒店c3动画最外层
		var $hotelFromInput = $('.js-hotelFrom-input'); //酒店出发地
		var $hotelDate = $('.js-hotelDate-result'); //酒店日期
		var $hotelFromMenuSub = $('.js-hotelFrom-menu'); //酒店出发地下拉菜单
		var $hotelPeople = $('.js-hotel-people'); //酒店人数

		var $close = $('.js-hotelPopup-close');
		var $searchInput = $('.js-hotelCity-search'); //模糊搜索框
		var $searchTitle = $('.js-hotelPopup-title'); //标题

		var winHeight = $(window).height();

		var hideContainer = function(){
			$container.removeClass('is-show');
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		};
		var ovfHiden = function(){
			$('html,body').addClass('ovfHiden'); //使网页不可滚动
		};

		// 关闭弹出框
		$close.click(function(event) {
			hideContainer();
		});

		// 点击酒店
		$hotelFromInput.click(function(event) {
			$('.hotel-popup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-hotelPopup-from').show();

			$hotelFromMenuSub.empty();
			// $.each(that.hotelCityData,function(i,val){
				// $hotelFromMenuSub.append('<li>Please enter where you want to go</li>');
			// });

			ovfHiden(); //使网页不可滚动
			$hotelBox.height(winHeight-98);
			$searchInput.show().val('');
			
			$searchTitle.html('Select destination');

			$container.addClass('is-show');
			setTimeout(function(){
				$searchInput.focus();
			},600);
		});

		// 酒店选择 
		$hotelFromMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			$hotelFromInput.val(text1);
			hideContainer();
		});

		// 日期选择
		this.mDateSelect(false,'.js-hotelDate-result','.js-hotelPopup-date',true);
		$hotelDate.click(function(event) {
			$('.js-hotelPopup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-hotelPopup-date').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select dates');
			$hotelBox.height(winHeight-58);

			$container.addClass('is-show');
		});

		// 房间选择
		$hotelPeople.click(function(event) {
			$('.js-hotelPopup-content>div').hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-hotelPopup-people').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select rooms');
			$hotelBox.height(winHeight-58);

			$container.addClass('is-show');
		});

		//房间保存
		$('.js-mSelect-rooms').click(function(event) {
			hideContainer();
		});

		$('.js-hotelCity-search').keyup(function () {//.input为你的输入框
		    var term = $('.js-hotelCity-search').val();
		    $('.js-hotelFrom-menu').html('<li>Loading...</li>');
		    $.ajax({
		        url: "http://hotels.lanmeiairlines.com/soap/auto-complete-general",
		        dataType: 'json',
		        data: {
		            term: term,
		        },
		        success: function (data) {
		            var str = '';
		            for (var i = 0; i < data.length; i++) {
		                str += '<li title="' + data[i].value + '"data-cate ="' + data[i].cate + '" data-id ="' + data[i].id + '">' + data[i].value + '</li>';
		            }
		            $('.js-hotelFrom-menu').html(str);
		        }
		    });
		});
	},

	/* 机+酒选择 */
	ticketHotelSelect:function(){
		/* 最外层div */
		var $mask = $('.js-ticket-mask'); //遮罩层
		var $mask2 = $('.js-ticket-mask2'); //遮罩层2
		var $box = $('.js-thPopup-box'); //c3动画最外层
		var $content = $('.js-thPopup-content'); //c3动画内容
		
		// 输入框
		var $fromInput = $('.js-thFrom-input'); //机票出发地
		var $toInput = $('.js-thTo-input'); //机票目的地
		var $date = $('.js-thDate-result'); //机票日期
		var $people = $('.js-ticketHotel-people'); //机票人数

		// 下拉菜单
		var $fromMenuSub = $('.js-thFrom-menu'); //机票出发地下拉菜单
		var $toMenuSub = $('.js-thTo-menu'); //目的地下拉菜单
		var $ticketChange = $('.js-ticketHotel-change'); //切换机票出发地和目的地

		// 下拉菜单外层
		var $fromBox = $('.js-thAirport-from'); //出发地外层
		var $toBox = $('.js-thAirport-to'); //目的地外层
		var $dateBox = $('.js-thPopup-date'); //日期外层
		var $peopleBox = $('.js-ticketHotelPopup-people'); //人数选择外层
		var $popupContent = $('.popup-content');
		
		/* 切换状态 */
		var $selectWay = $('.js-thSelect-way'); //选择单程往返
		
		/* 第一个div，点击后展示其他div */
		var $ticketFrom = $('.js-ticketHotel-from'); //出发地div
		var $zoom = $('.js-ticketHotel-to,.js-ticketHotel-date,.js-ticketHotel-people,.js-ticketHotel-cancel,.js-ticketHotel-search');
		
		/* c3动画 */
		var popupShow = function(){
			$mask.fadeIn(); //显示遮罩层
			$mask2.fadeIn(); //显示遮罩层
			$ticketChange.show(); //显示出发地和目的地切换
			$box.addClass('popup-box-before'); //展示小箭头
			$content.removeClass('popup-inactive').addClass('popup-active'); 
		};
		var popupHide = function(){
			$content.removeClass('popup-active').addClass('popup-inactive'); 
			$box.removeClass('popup-box-before'); //隐藏小箭头
		};
		
		/* 日期选择 */
		var that = this;
		this.dateSelect(false,'.js-thDate-result','.js-thPopup-date',false,$box,$dateBox,$peopleBox,'Choose your departure date :','Choose your return date :');
		
		/* 单程往返切换 */
		$('.js-thSelect-way>a').click(function(event) {
			event.stopPropagation();
			$(this).addClass('active').siblings('a').removeClass('active');
			var data = $(this).attr('data-way');
			switch (data) {
				case 'round':
					that.dateSelect(false,'.js-thDate-result','.js-thPopup-date',false,$box,$dateBox,$peopleBox,'Choose your departure date :','Choose your return date :');
					$('.js-thDate-result').click(); //日期展示
					$('#th-tripType').val('RT');
					break;
				case 'one':
					that.dateSelect(true,'.js-thDate-result','.js-thPopup-date',false,$box,$dateBox,$peopleBox,'Choose your departure date :','Choose your return date :');
					$('.js-thDate-result').click(); //日期展示
					$('#th-tripType').val('OW');
					break;
				}
			});

		/* 出发地和目的地切换 */
		$ticketChange.click(function(event) {
			var fVal = $fromInput.val();
			var tVal = $toInput.val();
			$fromInput.val(tVal);
			$toInput.val(fVal);
		});

		/* 获取屏幕尺寸 */
		var winWidth = $(window).width();

		/* 设置出发地下拉的值 */
		var fromCityVal = function(text){ 
			var fromcityArr = that.thFromCityData;
			$fromMenuSub.empty();
			$.each(fromcityArr,function(i,val){
				$fromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			$('.js-thFrom-menu>li:first').addClass('active');
		};

		/* 设置目的地下拉的值 */
		var toCityVal = function(text){
			var tocityArr = that.thToCityData;
			$toMenuSub.empty();
			$.each(tocityArr,function(i,val){
				$toMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});	
			$('.js-thTo-menu>li:first').addClass('active');		
		};

		/* 点击机票出发地 */
		var zoomShow = true;
		var oneClick = true;
		$fromInput.click(function(){
			if(oneClick){ //防止点击取消后，快速点击出发地产生的bug
				fromCityVal($toInput.attr('data-city')); //下拉菜单赋值
				
				if(winWidth>1200){
					$box.css('left',0);
				}else if(winWidth<=1200){
					$box.css({'top':-88,'left':0});
				}
				popupShow(); //增加c3动画
				$box.removeClass('hotelPeople-popup-box'); //移动before小箭头
				$fromBox.show();
				$toBox.hide(); $dateBox.hide(); $peopleBox.hide();

				$content.css({'left':0,'z-index':'1'}); //防止位移偏差 覆盖cancel按钮

				if(zoomShow){
					$selectWay.css({'height':'auto','margin-top':'40px'}); //展示单程往返
					$zoom.addClass('animated fadeInUp').css('visibility','visible');
					zoomShow = false; //重新点击出发地时再次显示目的地、日期、人数的动画
					setTimeout(function(){
						$zoom.removeClass('animated fadeInUp');
					}, 2200);
				}
			}
		});

		/* 点击机票目的地 */
		$toInput.click(function(e){
			toCityVal($fromInput.attr('data-city')); //下拉菜单赋值

			if(winWidth>1200){
				$box.css('left',350);
			}else if(winWidth<=1200){
				$box.css({'top':-88,'left':350});
			}
			popupShow(); //增加c3动画
			$box.removeClass('hotelPeople-popup-box'); //移动before小箭头
			$content.css({'left':0,'z-index':'1'}); //防止位移偏差 覆盖cancel按钮
			$toBox.show();
			$fromBox.hide(); $dateBox.hide(); $peopleBox.hide();
		});

		/* 点击机票日期 */
		$date.click(function(event) {
			if(winWidth>1200){
				$box.css('left',700);
			}else if(winWidth<=1200){
				$box.css({'top':-10,'left':0});
			}
			popupShow(); //增加c3动画
			$box.removeClass('hotelPeople-popup-box'); //移动before小箭头
			$content.css({'left':0,'z-index':'1'}); //防止位移偏差 覆盖cancel按钮
			$dateBox.show();
			$fromBox.hide(); $toBox.hide(); $peopleBox.hide();
		});

		/* 点击酒店人数 */
		var $that = this;
		$people.click(function(event) {
			if(winWidth>1200){
				$box.css('left',1020);
			}else if(winWidth<=1200){
				$box.css({'top':-10,'left':320});
			}
			popupShow(); //增加c3动画
			$popupContent.css('z-index','1'); //覆盖cancel按钮
			$peopleBox.show();
			$fromBox.hide(); $toBox.hide(); $dateBox.hide();
		});

		/* 点击取消 */
		var cancel = function(){
			oneClick = false; //防止快速点击出发地

			$zoom.addClass('animated fadeOutDown');

			$selectWay.css({'height':'0','margin-top':'0'}); //隐藏单程往返

			$mask.fadeOut(); //隐藏遮罩层
			$mask2.fadeOut(); //隐藏遮罩层

			popupHide(); //隐藏弹出内容层
			$ticketChange.hide(); //隐藏出发地和目的地切换

			zoomShow = true; //重新点击出发地时再次显示目的地、日期、人数的动画

			$box.css('left',0); //下拉框归零
			setTimeout(function(){
				$zoom.removeClass('animated fadeOutDown');

				// $selectWay.removeClass('animated fadeOutDown');

				$zoom.css('visibility','hidden');

		      oneClick = true; //可以继续点击出发地
		    }, 2200);
		};

		/* 点击遮罩层 */
		$mask.click(function(){
			cancel();
		});
		$mask2.click(function(){
			popupHide(); //隐藏弹出内容层
			$(this).fadeOut();
		});
		$('.js-thSelect-way,.js-tips-com').click(function(event) {
			popupHide(); //隐藏弹出内容层
			$mask2.fadeOut();
		});

		/* 点击取消 */
		$('.js-ticketHotel-cancel').click(function(){
			cancel();
		});

		/* 删除数组中某个元素 */
		Array.prototype.indexOf = function (val) {
			for(var i = 0; i < this.length; i++){
				if(this[i] == val){return i;}
			}
			return -1;
		};
		Array.prototype.remove = function (val) {
			var index = this.indexOf(val);
			if(index > -1){this.splice(index,1);}
		};

		/* 机票出发地选择 */
		$fromMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$fromInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1); //出发地赋值
			toCityVal(text1); //下拉菜单赋值筛选

			if(winWidth>1200){
				$box.css('left',350);
			}else if(winWidth<=1200){
				$box.css({'top':-88,'left':350});
			}

			$toInput.focus();
			$('.js-thTo-menu>li:first').addClass('active');

			$fromBox.slideUp(function(){ //出发地隐藏
				$toBox.slideDown(); //目的地显示
			}); 
		});

		/* 机票目的地选择 */
		$toMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$toInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1);
			if(winWidth>1200){
				$box.css('left',700);
			}else if(winWidth<=1200){
				$box.css({'top':-10,'left':0});
			}
			$toBox.slideUp(function(){ //出发地隐藏
				$date.click(); //日期展示
				$dateBox.slideDown(); //目的地显示
			}); 
		});

		// 模糊匹配
		this.autoComplete('.js-thFrom-input');
		this.autoComplete('.js-thTo-input');

		// 键盘事件
		this.keyEvent('.js-thFrom-input','.js-thFrom-menu',that.indexLiFrom);
		this.keyEvent('.js-thTo-input','.js-thTo-menu',that.indexLiTo); 

		/* 机票搜索 --- 按钮点击 */
		$('.js-ticketHotel-search').click(function () {
		    var adultNum = $('.js-p-ticketHotelAdult').text();
		    var childNum = $('.js-p-ticketHotelChild').text();
		    var roomNum = $('.js-p-ticketHotelRooms').text();
		    var startDate = $date.attr('data-start');
		    var endDate = $date.attr('data-end');
		    var orgCity = ($fromInput.val()).substring(($fromInput.val()).indexOf('/') + 1);
		    var dstCity = ($toInput.val()).substring(($toInput.val()).indexOf('/') + 1);
		    $('#th-adultCount').val(adultNum);
		    $('#th-childCount').val(childNum);
		    $('#th-roomCount').val(roomNum);
		    $('#th-takeoffDate').val(startDate);
		    $('#th-returnDate').val(endDate);
		    $('#th-orgcity').val(orgCity);
		    $('#th-dstcity').val(dstCity);
		    $('#air-ticketHotel-form').submit();
		});
	},

	/* 移动端机+酒选择 */
	mTicketHotelSelect:function(){
		var that = this;

		// 最外层容器
		var $container = $('.js-popup-container');
		var $box = $('.js-thPopup-box');

		// 关闭容器按钮
		var $close = $('.js-thPopup-close');

		// 出发地和目的地外层
		var $cityFrom = $('.js-ticketHotel-from');
		var $cityTo = $('.js-ticketHotel-to');

		// 输入框
		var $fromInput = $('.js-thFrom-input'); //机票出发地
		var $fromSpan = $('.js-m-thFcity');
		var $toInput = $('.js-thTo-input'); //机票目的地
		var $toSpan = $('.js-m-thTcity');
		var $date = $('.js-thDate-result'); //机票日期
		var $hotelPeople = $('.js-ticketHotel-people'); //机票人数
		var $popupDiv = $('.js-thPopup-content>div');

		var $searchInput = $('.js-thCity-search'); //模糊搜索框
		var $searchTitle = $('.js-thPopup-title'); //标题

		// 下拉菜单
		var $fromMenuSub = $('.js-thFrom-menu'); //机票出发地下拉菜单
		var $toMenuSub = $('.js-thTo-menu'); //目的地下拉菜单
		var $ticketChange = $('.js-ticketHotel-change'); //切换机票出发地和目的地

		var winHeight = $(window).height();

		var hideContainer = function(){
			$container.removeClass('is-show');
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		};
		var ovfHiden = function(){
			$('html,body').addClass('ovfHiden'); //使网页不可滚动
		};

		// 关闭弹出框
		$close.click(function(event) {
			hideContainer();
		});

		// 点击出发地
		$cityFrom.click(function(event) {
			$fromMenuSub.empty();
			$popupDiv.hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-thAirport-from').show();
			var toVal = $toInput.attr('data-city'); //获取目的地的值进行过滤
			$.each(that.thFromCityData,function(i,val){
				$fromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			$fromMenuSub.children('li:contains('+toVal+')').remove(); //过滤

			ovfHiden(); //使网页不可滚动
			$box.height(winHeight-98);
			$searchInput.show().attr('data','js-thFrom-menu').val('');
			$searchTitle.html('Select origin');

			$container.addClass('is-show');
		});

		// 机票出发地选择 
		$fromMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$fromInput.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$fromSpan.text(text2[0]+'/'+text2[2]);
			hideContainer();
		});

		// 点击目的地
		$cityTo.click(function(event) {
			$toMenuSub.empty();
			$popupDiv.hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-thAirport-to').show();
			var fromVal = $fromInput.attr('data-city'); //获取出发地的值进行过滤
			$.each(that.thToCityData,function(i,val){
				$toMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});

			$toMenuSub.children('li:contains('+fromVal+')').remove(); //过滤

			ovfHiden(); //使网页不可滚动
			$box.height(winHeight-98);
			$searchInput.show().attr('data','js-thTo-menu').val('');
			$searchTitle.html('Select destination');

			$container.addClass('is-show');
		});

		// 机票目的地选择 
		$toMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$toInput.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$toSpan.text(text2[0]+'/'+text2[2]);
			hideContainer();
		});

		// 出发地和目的地切换
		$('.js-mTicketHotel-change').click(function(event) {
			var fVal = $fromInput.val();
			var fSpan = $fromSpan.text();
			var tVal = $toInput.val();
			var tSpan = $toSpan.text();
			$fromInput.val(tVal); $fromSpan.text(tSpan);
			$toInput.val(fVal); $toSpan.text(fSpan);
		});

		// 模糊匹配
		this.autoComplete('.js-thCity-search');

		// 日期选择
		this.mDateSelect(false,'.js-thDate-result','.js-thPopup-date',false);
		$date.click(function(event) {
			$popupDiv.hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-thPopup-date').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select dates');
			$box.height(winHeight-58);

			$container.addClass('is-show');
		});

		// 单程往返切换 
		$('.js-thSelect-way>a').click(function(event) {
			event.stopPropagation();
			$(this).addClass('active').siblings('a').removeClass('active');
			var data = $(this).attr('data-way');
			switch (data) {
				case 'round':
					that.mDateSelect(false,'.js-thDate-result','.js-thPopup-date',false);
					break;
					case 'one':
					that.mDateSelect(true,'.js-thDate-result','.js-thPopup-date',false);
					break;
				}
			});

		// 房间选择
		$hotelPeople.click(function(event) {
			$popupDiv.hide(); //初始化隐藏出发地、目的地、日期、人数
			$('.js-ticketHotelPopup-people').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select rooms');
			$box.height(winHeight-58);

			$container.addClass('is-show');
		});
		//房间保存 
		$('.js-mThSelect-people').click(function(event) {
			hideContainer();
		});
	},

	/* 租车选择 */
	carSelect:function(){
		var $mask = $('.js-ticket-mask'); //遮罩层
		var $mask2 = $('.js-ticket-mask2'); //遮罩层2
		var $carBox = $('.js-carPopup-box'); //租车c3动画最外层
		var $carContent = $('.js-carPopup-content'); //租车c3动画内容

		/* 输入框 */
		var $routeIdInput = $('.js-routeId-input'); //预订路线
		var $ticketTypeInput = $('.js-ticketType-input'); //票种
		var $peopleNumInput = $('.js-peopleNum-input'); //票种

		/* 下拉菜单 */
		var $routeIdMenuSub = $('.js-routeId-menu'); 
		var $ticketTypeMenuSub = $('.js-ticketType-menu'); 

		/* 下拉菜单外层 */
		var $routeIdBox = $('.js-carPopup-routeId'); 
		var $ticketTypeBox = $('.js-carPopup-ticketType'); 

		/* 点击第一个div,然后显示其他div  */
		var $ticketNum = $('.js-route-id'); //机票号div
		var $carZoom = $('.js-ticket-type,.js-people-num,.js-car-cancel,.js-car-search');

		/* css3动画 */
		var carPopupShow = function(){
			$mask.fadeIn(); //显示遮罩层
			$mask2.fadeIn(); //显示遮罩层
			$carBox.addClass('popup-box-before'); //展示小箭头
			$carContent.removeClass('popup-inactive').addClass('popup-active'); 
		};
		var carPopupHide = function(){
			$carContent.removeClass('popup-active').addClass('popup-inactive'); 
			$carBox.removeClass('popup-box-before'); //隐藏小箭头
		};

		/* 获取屏幕尺寸 */
		var winWidth = $(window).width();
		var that = this;

		/* 预定路线 */
		var carZoomShow = true;
		var carOneClick = true;
		/* 预订路线 */
		$routeIdInput.click(function(){
			if(carOneClick){ //防止点击取消后，快速点击出发地产生的bug
				if(winWidth>1200){
					$carBox.css('left',0);
				}else if(winWidth<=1200){
					$carBox.css({'top':-90,'left':0});
				}
				carPopupShow(); //增加c3动画
				$carContent.css('z-index','1'); //覆盖cancel按钮
				$routeIdBox.show();
				$ticketTypeBox.hide();

				if(carZoomShow){
					$carZoom.addClass('animated fadeInUp').css('visibility','visible');
					carZoomShow = false; 
					setTimeout(function(){
						$carZoom.removeClass('animated fadeInUp');
					}, 2200);
				}
			}
		}).one('click',function(){
			$routeIdMenuSub.empty();
			$.each(that.carRouteData,function(i,val){
				$routeIdMenuSub.append('<li><span title="'+val+'">'+val+'</span> <p class="js-route-details" data="route-id-'+i+'" title="Route details"></p> </li>');
			});
			// $('.js-from-menu>li:first').addClass('active');
			// that.keyEvent('.js-routeId-input','.js-routeId-menu',that.indexLiFrom); //绑定键盘事件
		});

		/* 弹出大巴路线详情 */
		var routeHtml_1 = '<img src="images/EN/airport-route-1.jpg" alt="Route details">';
		var routeHtml_2 = '<img src="images/EN/airport-route-2.jpg" alt="Route details">';

		$routeIdMenuSub.on('click','.js-route-details',function(){
			$('#js-routeIdModal').modal();
			var data = $(this).attr('data');
			if(data=='route-id-0'){
				$('.js-routeId-content').html(routeHtml_1);
			}else if(data=='route-id-1'){
				$('.js-routeId-content').html(routeHtml_2);
			}
		});
		$('.js-routeId-content').click(function(event) {
			var src = $(this).children('img').attr('src');
			layer.open({
			  area: ['90%', 'auto'],
			  type: 1,
			  shadeClose: true,
			  title: false, //不显示标题
			  content: '<img src="'+src+'" alt="Route details" style="width:100%;margin-top:30px;">'
			});
		});

		/* 机票类型 */
		$ticketTypeInput.click(function(){
			if(winWidth>1200){
				$carBox.css('left',700);
			}else if(winWidth<=1200){
				$carBox.css({'top':-10,'left':0});
			}
			carPopupShow(); //增加c3动画
			$carContent.css('z-index','1'); //覆盖cancel按钮
			$routeIdBox.hide();
			$ticketTypeBox.show();
		}).one('click',function(){
			$ticketTypeMenuSub.empty();
			$.each(that.carTicketTypeData,function(i,val){
				$ticketTypeMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			// $('.js-from-menu>li:first').addClass('active');
			// that.keyEvent('.js-ticketType-input','.js-ticketType-menu',that.indexLiFrom); //绑定键盘事件
		});

		/* 点击取消 */
		var cancel = function(){
			carOneClick = false; //防止快速点击出发地

			$carZoom.addClass('animated fadeOutDown');

			$mask.fadeOut(); //隐藏遮罩层
			$mask2.fadeOut(); //隐藏遮罩层

			carPopupHide(); //隐藏弹出内容层

			carZoomShow = true; //重新点击出发地时再次显示目的地、日期、人数的动画

			$carBox.css('left',0); //下拉框归零
			setTimeout(function(){
				$carZoom.removeClass('animated fadeOutDown');
				$carZoom.css('visibility','hidden');
	      		carOneClick = true; //可以继续点击出发地
	    	}, 2200);
		};

		/* 点击遮罩层 */
		$mask.click(function(){
			cancel();
		});
		$mask2.click(function(){
			carPopupHide(); //隐藏弹出内容层
			$(this).fadeOut();
		});

		$('.js-tips-com').click(function(event) {
			carPopupHide(); //隐藏弹出内容层
			$mask2.fadeOut();
		});

		/* 点击取消 */
		$('.js-car-cancel').click(function(){
			cancel();
		});

		/* 租车路线选择 */
		$routeIdMenuSub.on('click','>li>span',function(){
			var text = $(this).attr('title');
			$routeIdInput.val(text);
			if(winWidth>1200){
				$carBox.css('left',700);
			}else if(winWidth<=1200){
				$carBox.css({'top':-10,'left':0});
			}
			$routeIdBox.hide();
			$ticketTypeBox.show();

			$ticketTypeMenuSub.empty();
			$.each(that.carTicketTypeData,function(i,val){
				$ticketTypeMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});

			$routeIdBox.slideUp(function(){ //酒店出发地隐藏
				$ticketTypeBox.slideDown(); //酒店日期显示
			}); 
		});

		/* 票种选择 */
		$ticketTypeMenuSub.on('click','>li',function(){
			var text = $(this).attr('title');
			$ticketTypeInput.val(text);
			$peopleNumInput.focus();
			carPopupHide();
		});

		/* 机票人数只能输入数字 */
		$peopleNumInput.keyup(function(event) {
			$(this).val($(this).val().replace(/[^\d]/ig,''));
		});
	},

	/* 移动端租车选择 */
	mCarSelect:function(){
		var that = this;
		var $container = $('.js-popup-container');
		var $carBox = $('.js-carPopup-box'); //租车c3动画最外层
		var $routeIdInput = $('.js-routeId-input'); //预订路线
		var $ticketTypeInput = $('.js-ticketType-input'); //票种
		var $routeIdMenuSub = $('.js-routeId-menu'); 
		var $ticketTypeMenuSub = $('.js-ticketType-menu'); 

		var $close = $('.js-carPopup-close');
		var $searchInput = $('.js-routeId-search'); //模糊搜索框
		var $searchTitle = $('.js-carPouple-title'); //标题

		var winHeight = $(window).height();

		var hideContainer = function(){
			$container.removeClass('is-show');
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		};
		var ovfHiden = function(){
			$('html,body').addClass('ovfHiden'); //使网页不可滚动
		};

		// 关闭弹出框
		$close.click(function(event) {
			hideContainer();
		});

		// 预订路线
		$routeIdInput.click(function(event) {
			$('.js-carPopup-content>div').hide(); //初始化隐藏
			$('.js-carPopup-routeId').show();

			$routeIdMenuSub.empty();
			$.each(that.carRouteData,function(i,val){
				$routeIdMenuSub.append('<li><span title="'+val+'" data-val="'+i+'">'+val+'</span> <p class="js-route-details" data="route-id-'+i+'" title="Route details"></p> </li>');
			});

			ovfHiden(); //使网页不可滚动
			$searchInput.hide();
			$carBox.height(winHeight-58);
			$searchTitle.html('Choose your route id');

			$container.addClass('is-show');
		});

		/* 弹出大巴路线详情 */
		var routeHtml_1 = '<ul>'+
				'<li>Phnom Penh International Airport</li>'+
				'<li>Le President Hotel</li>'+
				'<li>Raffles Hotel Le Royal</li>'+
				'<li>Sunway Hotel</li>'+
				'<li>Preah Sisowath High School</li>'+
				'<li>NagaWorld Hotel & Entertainment Complex</li>'+
				'<li>Toyoko Inn Phnom Penh</li>'+
			'</ul>';
		var routeHtml_2 = '<ul>'+
				'<li>Phnom Penh International Airport</li>'+
				'<li>InterContinental Phnom Penh</li>'+
				'<li>Sihanouk West</li>'+
				'<li>Sihanouk East</li>'+
				'<li>NagaWorld Hotel & Entertainment Complex</li>'+
				'<li>Toyoko - Inn Phnom Penh</li>'+
				'<li>Hotel Sofitel Phnom Penh Phokeethra</li>'+
			'</ul>';

		$routeIdMenuSub.on('click','.js-route-details',function(e){
			e.stopPropagation();
			$('#js-routeIdModal').modal();
			var data = $(this).attr('data');
			if(data=='route-id-0'){
				$('.js-routeId-content').html(routeHtml_1);
			}else if(data=='route-id-1'){
				$('.js-routeId-content').html(routeHtml_2);
			}
		});

		// this.autoComplete('.js-routeId-search');

		// 预定路线选择 
		$routeIdMenuSub.on('click','>li>span',function(){
			var text1 = $(this).attr('title');
			$routeIdInput.val(text1);
			hideContainer();
		});

		// 票种路线
		$ticketTypeInput.click(function(event) {
			$('.js-carPopup-content>div').hide(); //初始化隐藏
			$('.js-carPopup-ticketType').show();

			$ticketTypeMenuSub.empty();
			$.each(that.carTicketTypeData,function(i,val){
				$ticketTypeMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});

			ovfHiden(); //使网页不可滚动
			$searchInput.hide();
			$carBox.height(winHeight-58);
			$searchTitle.html('Choose your ticket type');

			$container.addClass('is-show');
		});

		// this.autoComplete('.js-routeId-search');

		// 票种选择 
		$ticketTypeMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			$ticketTypeInput.val(text1);
			hideContainer();
		});
	},

	/* 航班动态选择 */
	fStatusSelect:function(){
		var $fStatusBox = $('.js-fStatusPopup-box'); //航班动态c3动画最外层
		var $fStatusContent = $('.js-fStatusPopup-content'); //航班动态c3动画内容

		/* 输入框 */
		var $fNumberFromInput = $('.js-fNumber-input'); //航班动态出发地
		var $routeFromInput = $('.js-routeFrom-input'); //航班动态出发地
		var $routeToInput = $('.js-routeTo-input'); //航班动态查询目的地
		var $numDate = $('.js-numDate-result'); //航班动态日期
		var $routeDate = $('.js-routeDate-result'); //航班动态日期

		/* 下拉菜单 */
		var $fNumberFromMenuSub = $('.js-fNumber-menu'); //航班号下拉菜单 --- 航班动态
		var $routeFromMenuSub = $('.js-routeFrom-menu'); //航班号下拉菜单 --- 航班动态
		var $routeToMenuSub = $('.js-routeTo-menu'); //航班号下拉菜单 --- 航班动态

		/* 下拉菜单外层 */
		var $routeFromBox = $('.js-routeBox-from'); //航班动态出发地外层
		var $routeToBox = $('.js-routeBox-to'); //航班动态目的地外层
		var $routeDateBox = $('.js-routePopup-date'); //航班动态日期外层
		var $fNumFromBox = $('.js-fNumBox-from'); //航班动态出发地外层
		var $numDateBox = $('.js-numPopup-date'); //航班动态日期外层

		/* css3动画 */
		var fStatusPopupShow = function(){
			$fStatusBox.addClass('popup-box-before'); //展示小箭头
			$fStatusContent.removeClass('popup-inactive').addClass('popup-active'); 
		};
		var fStatusPopupHide = function(){
			$fStatusContent.removeClass('popup-active').addClass('popup-inactive'); 
			$fStatusBox.removeClass('popup-box-before'); //隐藏小箭头
		};

		/* 设置出发地下拉的值 */
		var fromCityVal = function(text){ 
			var fromcityArr = that.cityData;
			$routeFromMenuSub.empty();
			$.each(fromcityArr,function(i,val){
				$routeFromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			$('.js-routeFrom-menu>li:first').addClass('active');
		};

		/* 设置目的地下拉的值 */
		var toCityVal = function(text){
			var tocityArr = that.cityData;
			$routeToMenuSub.empty();
			$.each(tocityArr,function(i,val){
				$routeToMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});	
			$('.js-routeTo-menu>li:first').addClass('active');		
		};

		/* 日期选择 */
		this.dateSelect(true,'.js-numDate-result','.js-numPopup-date',false,$fStatusBox,$numDateBox,'0','Flight flight date :','');
		this.dateSelect(true,'.js-routeDate-result','.js-routePopup-date',false,$fStatusBox,$routeDateBox,'0','Flight flight date :','');

		// 航班号和地点查询切换
		$('.js-flight-way>a').click(function(event) {
			event.stopPropagation();
			$(this).addClass('active').siblings('a').removeClass('active');
			var data = $(this).attr('data-way');
			$('.js-status-com').hide();
			$('.'+data).show();
			switch (data) {
				case 'js-by-number':
					fStatusPopupHide();
					$('#routeType').val(1);
				break;
				case 'js-by-route':
					fStatusPopupHide();
					$('#routeType').val(0);
				break;
			}
		});

		var that = this;
		/* 点击航班动态 按航班号查询 出发地 */
		$fNumberFromInput.click(function(e){
			e.stopPropagation();
			$fStatusBox.css('left',0);
			fStatusPopupShow(); //增加c3动画
			$('.js-fStatusPopup-content>div').hide();
			$fNumFromBox.show();
		}).one('click',function(){
			$fNumberFromMenuSub.empty();
			$.each(that.fNumberData,function(i,val){
				$fNumberFromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			$('.js-fNumber-menu>li:first').addClass('active');
		});

		this.autoComplete('.js-fNumber-input'); //模糊搜索
		this.keyEvent('.js-fNumber-input','.js-fNumber-menu',that.indexLiFlightNum); //绑定键盘事件

		/* 点击航班动态 按地址查询 出发地 */
		$routeFromInput.click(function(e){
			e.stopPropagation();
			fromCityVal($routeToInput.attr('data-city')); //下拉菜单赋值
			$(this).select();
			$fStatusBox.css('left',0);
			fStatusPopupShow(); //增加c3动画

			$('.js-fStatusPopup-content>div').hide();
			$routeFromBox.show();
		});

		/* 点击航班动态 按地址查询 目的地 */
		$routeToInput.click(function(e){
			e.stopPropagation();
			toCityVal($routeFromInput.attr('data-city')); //下拉菜单赋值
			$(this).select();
			$fStatusBox.css('left',290);
			fStatusPopupShow(); //增加c3动画

			$('.js-fStatusPopup-content>div').hide();
			$routeToBox.show();
		});

		this.autoComplete('.js-routeFrom-input'); //模糊搜索
		this.autoComplete('.js-routeTo-input'); //模糊搜索

		this.keyEvent('.js-routeFrom-input','.js-routeFrom-menu',that.indexLiRouteFrom); //绑定键盘事件
		this.keyEvent('.js-routeTo-input','.js-routeTo-menu',that.indexLiRouteTo); //绑定键盘事件

		/* 点击航班号日期 --- 航班动态查询 */
		$numDate.click(function(e) {
			e.stopPropagation();
			$fStatusBox.css('left',580);
			fStatusPopupShow(); //增加c3动画
			$('.js-fStatusPopup-content>div').hide();
			$numDateBox.show();
		});

		/* 点击航班号日期 --- 目的地查询 */
		$routeDate.click(function(e) {
			e.stopPropagation();
			$fStatusBox.css('left',580);
			fStatusPopupShow(); //增加c3动画
			$('.js-fStatusPopup-content>div').hide();
			$routeDateBox.show();
		});

		/* 点击隐藏下拉框 */
		$('html').click(function(){
			fStatusPopupHide(); //隐藏弹出内容层
		});
		/* 阻止冒泡 */
		$('.js-routePopup-date,.js-numPopup-date').click(function(e){
			e.stopPropagation();
		});

		/* 航班号选择 --- 航班动态查询 */
		$fNumberFromMenuSub.on('click','>li',function(e){
			e.stopPropagation();
			var text = $(this).attr('title');
			$fNumberFromInput.val(text);
			$fStatusBox.css('left',580);
			$fNumFromBox.slideUp(function(){ 
				$('.js-numDate-result').click(); //日期展示
				$numDateBox.slideDown(); 
			}); 
		});

		/* 航班号选择 --- 出发地查询 */
		$routeFromMenuSub.on('click','>li',function(e){
			e.stopPropagation();
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$routeFromInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1); //出发地赋值
			toCityVal(text1); //下拉菜单赋值筛选

			$fStatusBox.css('left',290);

			$routeToInput.select();
			$('.js-routeTo-menu>li:first').addClass('active');

			$routeFromBox.slideUp(function(){ //酒店出发地隐藏
				$routeToBox.slideDown(); //酒店日期显示
			}); 
		});

		/* 航班号选择 --- 目的地查询 */
		$routeToMenuSub.on('click','>li',function(e){
			e.stopPropagation();
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$routeToInput.val(text2[0]+'/'+text2[1]).attr('data-city',text1);

			$fStatusBox.css('left',580);
			$routeToBox.slideUp(function(){ //航班动态目的地隐藏
				$('.js-routeDate-result').click(); //日期展示
				$routeDateBox.slideDown(); //酒店日期显示
			}); 
		});

		/* 航班动态搜索按钮点击 */
		$('.js-route-search').click(function () {
		    var startDate = $('.js-numDate-result').attr('data-start');
		    $('#fStatus-timeFrom').val(startDate);
		    var url = "/flight/getFlight.jhtml";
		    $("#air-fStatus-form").attr("action", url);
		    $('#air-fStatus-form').submit();
		});
	},

	/* 移动端航班动态选择 */
	mfStatusSelect:function(){
		var that = this;

		var $container = $('.js-popup-container');
		var $fStatusBox = $('.js-fStatusPopup-box'); //航班动态c3动画最外层

		/* 输入框 */
		var $fNumberFromInput = $('.js-fNumber-input'); //航班动态出发地
		var $fromSpan = $('.js-m-fRouteCity');
		var $routeFromInput = $('.js-routeFrom-input'); //航班动态出发地
		var $toSpan = $('.js-m-tRouteCity');
		var $routeToInput = $('.js-routeTo-input'); //航班动态查询目的地
		var $numDate = $('.js-numDate-result'); //航班动态日期
		var $routeDate = $('.js-routeDate-result'); //航班动态日期

		/* 下拉菜单 */
		var $fNumberFromMenuSub = $('.js-fNumber-menu'); //航班号下拉菜单 --- 航班动态
		var $routeFromMenuSub = $('.js-routeFrom-menu'); //航班号下拉菜单 --- 航班动态
		var $routeToMenuSub = $('.js-routeTo-menu'); //航班号下拉菜单 --- 航班动态

		/* 下拉菜单外层 */
		var $routeFromBox = $('.js-routeBox-from'); //航班动态出发地外层
		var $routeToBox = $('.js-routeBox-to'); //航班动态目的地外层
		var $routeDateBox = $('.js-routePopup-date'); //航班动态日期外层
		var $fNumFromBox = $('.js-fNumBox-from'); //航班动态出发地外层
		var $numDateBox = $('.js-numPopup-date'); //航班动态日期外层

		var $close = $('.js-fStatusPopup-close');
		var $searchInput = $('.js-fStatusCity-search'); //模糊搜索框
		var $searchTitle = $('.js-fStatusPopup-title'); //标题

		var winHeight = $(window).height();

		var hideContainer = function(){
			$container.removeClass('is-show');
			$('html,body').removeClass('ovfHiden'); //使网页可滚动
		};
		var ovfHiden = function(){
			$('html,body').addClass('ovfHiden'); //使网页不可滚动
		};

		// 关闭弹出框
		$close.click(function(event) {
			hideContainer();
		});

		// 航班号和地点查询切换
		$('.js-flight-way>a').click(function(event) {
			event.stopPropagation();
			$(this).addClass('active').siblings('a').removeClass('active');
			var data = $(this).attr('data-way');
			$('.js-status-com').hide();
			$('.'+data).show();
			switch (data) {
				case 'js-by-number':
				$('.js-by-number').show();
				break;
				case 'js-by-route':
				$('.js-by-route').show();
				break;
			}
		});

		// 点击航班号
		$fNumberFromInput.click(function(event) {
			$('.js-fStatusPopup-content>div').hide(); 
			$('.js-fNumBox-from').show();

			$fNumberFromMenuSub.empty();
			$.each(that.fNumberData,function(i,val){
				$fNumberFromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});

			ovfHiden(); //使网页不可滚动
			$searchInput.show();
			$fStatusBox.height(winHeight-98);
			$searchInput.show().attr('data','js-fNumber-menu').val('');
			$searchTitle.html('Select destination');

			$container.addClass('is-show');

			// 模糊查询
			that.autoComplete('.js-fStatusCity-search');
		});

		// 航班号选择 
		$fNumberFromMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			$fNumberFromInput.val(text1);
			hideContainer();
		});

		// 日期选择
		this.mDateSelect(true,'.js-numDate-result','.js-numPopup-date',false);
		$numDate.click(function(event) {
			$('.js-fStatusPopup-content>div').hide(); 
			$('.js-numPopup-date').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select date');
			$fStatusBox.height(winHeight-58);

			$container.addClass('is-show');
		});

		// 点击出发地
		$routeFromInput.click(function(event) {
			$routeFromMenuSub.empty();
			$('.js-fStatusPopup-content>div').hide(); 
			$('.js-routeBox-from').show();
			var toVal = $routeToInput.attr('data-city'); //获取目的地的值进行过滤
			$.each(that.cityData,function(i,val){
				$routeFromMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});
			$routeFromMenuSub.children('li:contains('+toVal+')').remove(); //过滤

			ovfHiden(); //使网页不可滚动
			$searchInput.show();
			$fStatusBox.height(winHeight-98);
			$searchInput.show().attr('data','js-routeFrom-menu').val('');
			$searchTitle.html('Select origin');

			$container.addClass('is-show');
		});

		// 机票出发地选择 
		$routeFromMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$routeFromInput.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$fromSpan.text(text2[0]+'/'+text2[2]);
			hideContainer();
		});

		// 点击目的地
		$routeToInput.click(function(event) {
			$routeToMenuSub.empty();
			$('.js-fStatusPopup-content>div').hide(); 
			$('.js-routeBox-to').show();
			var fromVal = $routeFromInput.attr('data-city'); //获取出发地的值进行过滤
			$.each(that.cityData,function(i,val){
				$routeToMenuSub.append('<li title="'+val+'">'+val+'</li>');
			});

			$routeToMenuSub.children('li:contains('+fromVal+')').remove(); //过滤

			ovfHiden(); //使网页不可滚动
			$searchInput.show();
			$fStatusBox.height(winHeight-98);
			$searchInput.show().attr('data','js-routeTo-menu').val('');
			$searchTitle.html('Select destination');

			$container.addClass('is-show');
		});

		// 机票目的地选择 
		$routeToMenuSub.on('click','>li',function(){
			var text1 = $(this).attr('title');
			var text2 = text1.split('/');
			$routeToInput.val(text2[1]).attr('data-city',text1).parent().addClass('m-city-result');
			$toSpan.text(text2[0]+'/'+text2[2]);
			hideContainer();
		});

		// 出发地和目的地切换
		$('.js-mfStatus-change').click(function(event) {
			var fVal = $routeFromInput.val();
			var fSpan = $fromSpan.text();
			var tVal = $routeToInput.val();
			var tSpan = $toSpan.text();
			$routeFromInput.val(tVal); $fromSpan.text(tSpan);
			$routeToInput.val(fVal); $toSpan.text(fSpan);
		});

		// 模糊匹配
		this.autoComplete('.js-fStatusCity-search');

		// 日期选择
		this.mDateSelect(true,'.js-routeDate-result','.js-routePopup-date',false);
		$routeDate.click(function(event) {
			$('.js-fStatusPopup-content>div').hide(); 
			$('.js-routePopup-date').show();

			ovfHiden(); //使网页不可滚动

			$searchInput.hide();
			$searchTitle.text('Select date');
			$fStatusBox.height(winHeight-58);

			$container.addClass('is-show');
		});
	},

	/* PC和移动端都使用的事件 */
	ticketCommon:function(){
    /*二维码下载*/
    $('.js-car-search').click(function () {
    	$(this).html('Loading...');
    	setTimeout(function(){
    		layer.open({
    		  area: ['90%', 'auto'],
    		  type: 1,
    		  id: 'bus-download-id',
    		  shadeClose: true,
    		  title: false, //不显示标题 
    		  content: '<div class="bus-download-wrap"><div class="bus-code-wrap"><div class="bus-code-img"><img src="./images/EN/bus-code.jpg" /><a href="javascript:;" class="download-code-btn js-download-code">Download</a><p class="download-code-tips">Long press and save image</p></div><div class="bus-code-info"><h2>Instructions:</h2><p>1. Please download and keep the QR code which is the only certificate for ticket discount. Please keep it well!</p><p>2. Please show the QR code to the staff of ticket office and passenger will be given the preferential price of 3.5 USD/one-way/seat (Original price is 5 USD/one-way/seat).</p><p>3. There is no limit to service term of the QR code. Passengers can buy tickets with the QR code at KKSTAR ticket counter at any time.</p><a href="javascript:;" class="bus-info-more js-busInfo-more">More</a></div></div></div>'
    		});     
    	},3000);
    	setTimeout(function(){
      	$('.js-car-search').html('Search');
    	},4000);
		});

		$(document).on('click','.js-download-code',function(){
			alert('下载成功');
		});

		$(document).on('click','.js-busInfo-more',function(){
			layer.open({
			  area: ['auto', 'auto'],
			  type: 1,
			  shadeClose: true,
			  title: false, //不显示标题
			  content:'<div class="bus-code-info bus-code-detail"><h2>Notes:</h2><p>1. If the QR code is missing or if you failed to keep the QR Code, please reselect the routes and the number of tickets, and then generate the corresponding QR code.</p><p>2. The QR code is limited to the purchase of selected routes and the number of tickets. For any change, please reselect the info required and then generate the corresponding QR code.</p><p>3. In order to ensure driving safety, one seat is for one person as stipulated by airport bus. All passengers are required to purchase tickets.</p><p>4. Passengers are required to board strictly according to the time, date and route as stipulated by the ticket. Please find the ticket counter to change time if required, which is only permitted for once.</p><p>5. Any expired, unofficial modified, damaged, fragmented ticket and tickets without receipt or certificate will be refused for boarding and refund.</p></div>',
			}); 
		});
	},

	/* 改变酒店选择人数 */
	changeWidth:function(parame){
		// 动态改变酒店房间外层div的宽度和left
		var $hotelContent;
		var $hotelPeople;
		var childArray;
		if(parame=='ticketHotel'){
			$hotelContent = $('.js-thPopup-content');
			$hotelPeople = $('.js-ticketHotelPopup-people');
			childArray = $('.js-ticketHotelChild-num');
		}else{
			$hotelContent = $('.js-hotelPopup-content');
			$hotelPeople = $('.js-hotelPopup-people');
			childArray = $('.js-hotelChild-num');
		}
		
		var changeWidth = function(){
			var changeArray = [];
			$.each(childArray,function(idx,val){
				changeArray.push($(val).html());
			});
			var changeNum = Math.max.apply(Math,changeArray);

			// 外层移动
			if(changeNum==0){
				$hotelContent.css('left',0);
				$hotelPeople.width(638);
			}
			if(changeNum==1){
				$hotelContent.css('left',-175);
				$hotelPeople.width(812);
			}
			if(changeNum==2){
				$hotelContent.css('left',-348);
				$hotelPeople.width(986);
			}
			if(changeNum==3){
				$hotelContent.css('left',-523);
				$hotelPeople.width(1160);
			}
		};
		changeWidth();
	},

	/* 机票人数选择 */
	selectPeople:function(){
		var $adultResult = $('.js-p-adult>span');
		var $childResult = $('.js-p-child>span');
		var $infantResult = $('.js-p-infant>span');

		// 成人
		var adult = function(){
			$('.js-adult-add').click(function(){
				var childNum = $(this).parents('.js-s-adult').siblings('.js-s-child').find('.child-num').html();//获取小孩人数
				var adultNum = $(this).siblings('span').html();;//获取成人人数
				if(parseInt(childNum)+parseInt(adultNum)<8){
					adultNum++;
					$(this).siblings('span').html(adultNum);
					$adultResult.html(adultNum); //动态赋值
					adultNum==2 && $(this).siblings('.sub-people').removeClass('off-sub-operation');
				}else{
					$(this).addClass('off-add-operation');
				}
			});
			$('.js-adult-sub').click(function(){
				$(this).siblings('.add-people').removeClass('off-add-operation');
				var adultNum = $(this).siblings('span').html();;//获取成人人数
				adultNum--;
				if(adultNum<2){
					adultNum=1;
					$(this).addClass('off-sub-operation');
				}
				$(this).siblings('span').html(adultNum);
				$adultResult.html(adultNum); //动态赋值
			});
		};

		// 小孩
		var child = function(){
			$('.js-child-add').click(function(){
				var adultNum = $(this).parents('.js-s-child').siblings('.js-s-adult').find('.adult-num').html();//获取小孩人数
				var childNum = $(this).siblings('span').html();;//获取成人人数
				if(parseInt(childNum)+parseInt(adultNum)<8){
					childNum++;
					$(this).siblings('span').html(childNum);
					$childResult.html(childNum); //动态赋值
				}else{
					$(this).addClass('off-add-operation');
				}

				if(childNum==1){
					$(this).siblings('.sub-people').removeClass('off-sub-operation');
					$(this).parent().removeClass('disable');
				}
			});
			$('.js-child-sub').click(function(){
				$(this).siblings('.add-people').removeClass('off-add-operation');
				var childNum = $(this).siblings('span').html();;//获取成人人数
				childNum--;
				if(childNum<1){
					childNum=0;
					$(this).addClass('off-sub-operation');
					$(this).parent().addClass('disable');
				}
				$(this).siblings('span').html(childNum);
				$childResult.html(childNum); //动态赋值
			});
		};

		// 婴儿
		var infant = function(){
			$('.js-infant-add').click(function(){
				infantNum++;
				$(this).siblings('span').html(infantNum);
				$infantResult.html(infantNum); //动态赋值
				if(infantNum==1){
					$(this).siblings('.sub-people').removeClass('off-sub-operation');
					$(this).parent().removeClass('disable');
				}
			});
			$('.js-infant-sub').click(function(){
				infantNum--;
				if(infantNum<1){
					infantNum=0;
					$(this).addClass('off-sub-operation');
					$(this).parent().addClass('disable');
				}
				$(this).siblings('span').html(infantNum);
				$infantResult.html(infantNum); //动态赋值
			});
		};
		adult();
		child();
		infant();

		/* 人数提示 */
		var showAdultTip = 0;
		var showChildTip = 0;
		var showInfantTip = 0;
		var screenWidth = window.screen.width;
		var tipFn = function(className,content,showTip){
			$(className).mouseenter(function(event) {
				if(screenWidth>767){
					showTip = layer.tips(content, className,{
						tips: [2, '#8ec060'],
						time: 0
					});
				}else{
					showTip = layer.tips(content, className,{
						tips: [3, '#8ec060'],
						time: 0
					});
				}
			}).mouseleave(function(event) {
				layer.close(showTip);
			});
		};
		tipFn('.adult-tip','Adult',showAdultTip);
		tipFn('.child-tip','Passengers who have not reached their 12th birthday by the date of the last flight are considered child passengers Children 7 years old and older can travel alone with the consent of their parents.',showChildTip);
		tipFn('.infant-tip','Passengers 7 days old up to those who have not reached their 2nd birthday travel with infant status.',showInfantTip);
	},

	/* 机票+酒店人数选择 */
	selectThPeople:function(){
	    var $roomResult = $('.js-p-ticketHotelRooms>span');
	    var $adultResult = $('.js-p-ticketHotelAdult>span');
	    var $childResult = $('.js-p-ticketHotelChild>span');

	    $roomResult.html(1);
	    $adultResult.html(1);
	    $childResult.html(0);

	    var $peopleCon = $('.js-child-container');

	    function childAge(num){
	        var ageStr = '<div class="age-rooms-com rooms-content-com js-thAge-1">'+
	            '<div class="hotel-age-wrap people-number">'+
	            '<span class="age-result js-thAge-result">'+num+'</span>'+
	            '<div class="age-menu-box js-thAge-box">'+
	            '<ul class="hotel-age-menu js-thAge-menu">'+
	            '<li title="Age < 1 year old">&lt; 1</li>'+
	            '<li>2</li>'+
	            '<li>3</li>'+
	            '<li>4</li>'+
	            '<li>5</li>'+
	            '<li>6</li>'+
	            '<li>7</li>'+
	            '<li>8</li>'+
	            '<li>9</li>'+
	            '<li>10</li>'+
	            '<li>11</li>'+
	            '<li>12</li>'+
	            '</ul>'+
	            '</div>'+
	            '</div>';

	        $peopleCon.append(ageStr);
	    };

	    $('.js-child-container').on('click','.js-thAge-result',function(e){
	        e.stopPropagation();
	        $('.js-thAge-box').hide();
	        $(this).siblings('.js-thAge-box').show();
	    });
	    $peopleCon.on('click','.js-thAge-menu>li',function(){
	        var text = $(this).html();
	        $(this).parents('.js-thAge-box').siblings('span').html(text);
	        $('.js-thAge-box').hide();
	    });
	    $('.js-ticketHotelPopup-people').click(function(event) {
	        $('.js-thAge-box').hide();
	    });

	    // 动态改变房间数
	    var resultNum;
	    function changeRooms(adultNum,childNum){
	        var totalNum = Math.ceil((parseInt(childNum)+parseInt(adultNum))/3);
	        var singleNum = Math.ceil(parseInt(adultNum)/2);
	        totalNum > singleNum ? resultNum=totalNum : resultNum=singleNum;
	        $('.js-s-thRoom .rooms-num').html(resultNum);
	    };

	    // 房间
	    var rooms = function(){
	        $('.js-thRooms-add').click(function(){
	            $(this).siblings('.sub-people').removeClass('off-sub-operation');
	            var roomNum = $(this).siblings('span').html();
	            if(parseInt(roomNum)<8){
	                roomNum++;
	                $(this).siblings('span').html(roomNum);
	                $roomResult.html(roomNum); //动态赋值
	                roomNum==8 && $(this).addClass('off-add-operation');
	            }
	        });

	        $('.js-thRooms-sub').click(function(){
	            $(this).siblings('.add-people').removeClass('off-add-operation');
	            var roomNum = $(this).siblings('span').html();

	            if(roomNum>resultNum){
	                roomNum--;
	                $(this).siblings('span').html(roomNum);
	                $roomResult.html(roomNum); //动态赋值
	                roomNum==resultNum && $(this).addClass('off-sub-operation');
	            }
	        });
	    };

	    // 成人
	    var adult = function(){
	        $('.js-thAdult-add').click(function(){
	            $(this).siblings('.sub-people').removeClass('off-sub-operation');
	            var childNum = $(this).parents('.js-s-thAdult').siblings('.js-s-thChild').find('.child-num').html();//获取小孩人数
	            var adultNum = $(this).siblings('span').html();;//获取成人人数

	            if(parseInt(childNum)+parseInt(adultNum)<8){
	                adultNum++;
	                $(this).siblings('span').html(adultNum);
	                $adultResult.html(adultNum); //动态赋值
	                // adultNum==2 && $(this).addClass('off-add-operation');

	                // 动态修改房间数
	               changeRooms(adultNum,childNum);
	            }
	        });
	        $('.js-thAdult-sub').click(function(){
	            $(this).siblings('.add-people').removeClass('off-add-operation');
	            $(this).parents('.js-s-thAdult').siblings('.js-s-thChild').find('.child-num').html(0);//小孩人数归0
	            $(this).parents('.js-s-thAdult').siblings('.js-s-thChild').find('.people-number').addClass('disable');
	            $peopleCon.css('display','none');
	            $('.js-child-container>div').remove();

	            var adultNum = $(this).siblings('span').html();;//获取成人人数
	            var childNum = $(this).parents('.js-s-thAdult').siblings('.js-s-thChild').find('.child-num').html();

	            if(adultNum>1){
	                adultNum--;
	                $(this).siblings('span').html(adultNum);
	                $adultResult.html(adultNum); //动态赋值
	                // adultNum==1 && $(this).addClass('off-sub-operation');

	                // 动态修改房间数
	                changeRooms(adultNum,childNum);
	            }
	        });
	    };

	    // 小孩
	    var child = function(){
	        $('.js-thChild-add').click(function(){
	            $(this).siblings('.sub-people').removeClass('off-sub-operation');
	            var adultNum = $(this).parents('.js-s-thChild').siblings('.js-s-thAdult').find('.adult-num').html();
	            var childNum = $(this).siblings('span').html();;//获取成人人数
	            // if(parseInt(childNum)+parseInt(adultNum)<8){
	            if(parseInt(childNum)<parseInt(adultNum)*2 && parseInt(childNum)+parseInt(adultNum)<8){
	                childNum++;
	                $peopleCon.css('display','inline-block');
	                $(this).siblings('span').html(childNum);
	                $childResult.html(childNum); //动态赋值
	                childAge(1);

	                // 动态修改房间数
	                changeRooms(adultNum,childNum);
	            }else{
	                // $(this).addClass('off-add-operation');
	            }

	            if(childNum==1){
	                // $(this).siblings('.sub-people').removeClass('off-sub-operation');
	                $(this).parent().removeClass('disable');
	            }
	        });
	        $('.js-thChild-sub').click(function(){
	            $(this).siblings('.add-people').removeClass('off-add-operation');
	            var childNum = $(this).siblings('span').html();;//获取成人人数
	            var adultNum = $(this).parents('.js-s-thChild').siblings('.js-s-thAdult').find('.adult-num').html();
	            childNum--;
	            $('.js-child-container>div:last-child').remove();
	            if(childNum<1){
	                childNum=0;
	                $peopleCon.css('display','none');
	                // $(this).addClass('off-sub-operation');
	                $(this).parent().addClass('disable');
	            }
	            $(this).siblings('span').html(childNum);
	            $childResult.html(childNum); //动态赋值

	            // 动态修改房间数
	            changeRooms(adultNum,childNum);
	        });
	    };

	    rooms();
	    adult();
	    child();

	    /* 人数提示 */
	    var showAdultTip = 0;
	    var showChildTip = 0;
	    var showInfantTip = 0;
	    var screenWidth = window.screen.width;
	    var tipFn = function(className,content,showTip){
	        $(className).mouseenter(function(event) {
	            if(screenWidth>767){
	                showTip = layer.tips(content, className,{
	                    tips: [2, '#8ec060'],
	                    time: 0
	                });
	            }else{
	                showTip = layer.tips(content, className,{
	                    tips: [3, '#8ec060'],
	                    time: 0
	                });
	            }
	        }).mouseleave(function(event) {
	            layer.close(showTip);
	        });
	    };
	    tipFn('.thAdult-tip','Adult',showAdultTip);
	    tipFn('.thChild-tip','Passengers who have not reached their 12th birthday by the date of the last flight are considered child passengers Children 7 years old and older can travel alone with the consent of their parents.',showChildTip);
	},

	/* 酒店房间和人数选择 */
	selectHotelRooms:function(){
		/* 年龄选择 */
		var $that = this;
		$('.js-hotelPopup-people').on('click','.js-age-result',function(e){
			e.stopPropagation();
			$('.js-age-box').hide();
			$(this).siblings('.js-age-box').show();
		});
		$('.js-hotelPopup-people').on('click','.js-age-menu>li',function(){
			var text = $(this).html();
			$(this).parents('.js-age-box').siblings('span').html(text);
		});
		$('html,.js-hotelPopup-people').click(function(event) {
			$('.js-age-box').slideUp();
		});

		/* 增减房间数 */
		var $adultResult = $('.js-p-hotelAdult>span');
		var $childResult = $('.js-p-hotelChild>span');
		var $roomsResult = $('.js-p-hotelRooms>span');
		// 增加房间
		var roomsNum = 1;
		$('.js-add-rooms').click(function(event) {
			if(roomsNum<=2){
				roomsNum++;
				var $roomStr = '<div class="s-room-'+roomsNum+' s-room-com s-people-com animated fadeInUp" id="js-room'+roomsNum+'-inner">'+
				'<p class="rooms-title js-rooms-title">Room '+roomsNum+'</p>'+
				'<div class="adult-rooms-content rooms-content-com js-adultRooms-content">'+
				'<div class="hotel-people-prompt people-prompt">'+
				'<p class="p1">Adult</p>'+
				'</div>'+
				'<div class="hotel-people-number people-number">'+
				'<a href="javascript:;" class="sub-people off-sub-operation js-hotelAdult-sub"></a>'+
				'<span class="adult-num js-hotelAdult-num">2</span>'+
				'<a href="javascript:;" class="add-people js-hotelAdult-add"></a>'+
				'</div>'+
				'</div>'+
				'<div class="child-rooms-content rooms-content-com js-childRooms-content">'+
				'<div class="hotel-people-prompt people-prompt">'+
				'<p class="p1">Child</p>'+
				'</div>'+
				'<div class="hotel-people-number people-number disable">'+
				'<a href="javascript:;" class="sub-people off-sub-operation js-hotelChild-sub"></a>'+
				'<span class="adult-num js-hotelChild-num">0</span>'+
				'<a href="javascript:;" class="add-people js-hotelChild-add"></a>'+
				'</div>'+
				'</div>'+
				'<div class="age-rooms-com rooms-content-com animated fadeInUp js-age-1">'+
				'<div class="hotel-people-prompt people-prompt">'+
				'<p class="p1">Age/1</p>'+
				'</div>'+
				'<div class="hotel-age-wrap people-number">'+
				'<span class="age-result js-age-result">1</span>'+
				'<div class="age-menu-box js-age-box">'+
				'<ul class="hotel-age-menu js-age-menu">'+
				'<li title="Age < 1 year old">&lt; 1</li>'+
				'<li>2</li>'+
				'<li>3</li>'+
				'<li>4</li>'+
				'<li>5</li>'+
				'<li>6</li>'+
				'<li>7</li>'+
				'<li>8</li>'+
				'<li>9</li>'+
				'<li>10</li>'+
				'<li>11</li>'+
				'<li>12</li>'+
				'</ul>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="age-rooms-com rooms-content-com animated fadeInUp js-age-2">'+
				'<div class="hotel-people-prompt people-prompt">'+
				'<p class="p1">Age/2</p>'+
				'</div>'+
				'<div class="hotel-age-wrap people-number">'+
				'<span class="age-result js-age-result">1</span>'+
				'<div class="age-menu-box js-age-box">'+
				'<ul class="hotel-age-menu js-age-menu">'+
				'<li title="Age < 1 year old">&lt; 1</li>'+
				'<li>2</li>'+
				'<li>3</li>'+
				'<li>4</li>'+
				'<li>5</li>'+
				'<li>6</li>'+
				'<li>7</li>'+
				'<li>8</li>'+
				'<li>9</li>'+
				'<li>10</li>'+
				'<li>11</li>'+
				'<li>12</li>'+
				'</ul>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="age-rooms-com rooms-content-com animated fadeInUp js-age-3">'+
				'<div class="hotel-people-prompt people-prompt">'+
				'<p class="p1">Age/3</p>'+
				'</div>'+
				'<div class="hotel-age-wrap people-number">'+
				'<span class="age-result js-age-result">1</span>'+
				'<div class="age-menu-box js-age-box">'+
				'<ul class="hotel-age-menu js-age-menu">'+
				'<li title="Age < 1 year old">&lt; 1</li>'+
				'<li>2</li>'+
				'<li>3</li>'+
				'<li>4</li>'+
				'<li>5</li>'+
				'<li>6</li>'+
				'<li>7</li>'+
				'<li>8</li>'+
				'<li>9</li>'+
				'<li>10</li>'+
				'<li>11</li>'+
				'<li>12</li>'+
				'</ul>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>';

				var $roomTab = '<p class="" data-room="js-room'+roomsNum+'-inner"><span>Room '+roomsNum+'</span><b>×</b></p>';

				$('.js-rooms-container').append($roomStr);
				$('.js-add-roomsTab').append($roomTab);

				var adultNum = $adultResult.html();
				$adultResult.html(Number(adultNum)+2);

				var roomsTotletNum = $roomsResult.html();
				roomsTotletNum++;
				$roomsResult.html(roomsTotletNum);
			}
		});
		
		// 删减房间
		$('.js-add-roomsTab').on('click','b',function(){
			roomsNum--;
			var id = $(this).parent('p').attr('data-room');

			// 动态修改成人人数统计值
			var adultNum = $adultResult.html();
			var html = $('#'+id).find('.js-hotelAdult-num').html();
			adultNum-=Number(html);
			$adultResult.html(adultNum);

			// 动态修改小孩人数统计值
			var childNum = $childResult.html();
			var html = $('#'+id).find('.js-hotelChild-num').html();
			childNum-=Number(html);
			$childResult.html(childNum);

			// 动态修改房间数统计值
			var roomsTotletNum = $roomsResult.html();
			roomsTotletNum--;
			$roomsResult.html(roomsTotletNum);

			$('#'+id).remove();
			$(this).parent('p').remove();

			// 动态修改房间最外层宽度和left
			$that.changeWidth('hotel');

			// 动态修改房间数值
			$('.js-rooms-container>div:first').attr('id','js-room1-inner'); //第一个
			$('.js-rooms-container>div:first').children('.js-rooms-title').html('Room 1'); //第一个
			$('.js-rooms-container>div').eq(1).attr('id','js-room2-inner'); //第二个
			$('.js-rooms-container>div').eq(1).children('.js-rooms-title').html('Room 2'); //第二个

			$('.js-add-roomsTab>p:first').attr('data-room','js-room1-inner'); //第一个tab
			$('.js-add-roomsTab>p:first').children('span').html('Room 1'); //第一个tab的值
			$('.js-add-roomsTab>p').eq(1).attr('data-room','js-room2-inner'); //第二个tab
			$('.js-add-roomsTab>p').eq(1).children('span').html('Room 2'); //第二个tab的值
		});

		/* 增减人数 */
		// 成人
		var adult = function(){
			$('.js-hotelPopup-people').on('click','.js-hotelAdult-add',function(e){
				var adultNum = $(this).siblings('span').html();
				adultNum++;
				$(this).siblings('span').html(adultNum);

				adultNum==3 && $(this).siblings('.sub-people').removeClass('off-sub-operation');
				
				//动态赋值
				var spanVal = 0;
				var spanArray = $('.js-hotelAdult-num');
				$.each(spanArray,function(idx, val) {
					spanVal+=Number($(val).html());
				});
				$adultResult.html(spanVal); 
			});
			$('.js-hotelPopup-people').on('click','.js-hotelAdult-sub',function(e){
				var adultNum = $(this).siblings('span').html();
				adultNum--;
				if(adultNum<3){
					adultNum=2;
					$(this).addClass('off-sub-operation');
				}
				$(this).siblings('span').html(adultNum);
				
				//动态赋值
				var spanVal = 0;
				var spanArray = $('.js-hotelAdult-num');
				$.each(spanArray,function(idx, val) {
					spanVal+=Number($(val).html());
				});
				$adultResult.html(spanVal); 
			});
		};

		// 小孩
		var child = function(){
			// 动态增减年龄
			var changeAge = function(that,childNum){
				var $age1 = that.parents('.js-childRooms-content').siblings('.js-age-1');
				var $age2 = that.parents('.js-childRooms-content').siblings('.js-age-2');
				var $age3 = that.parents('.js-childRooms-content').siblings('.js-age-3');

				// 动态修改房间最外层宽度和left
				$that.changeWidth('hotel');

				// 显示隐藏
				if(childNum==0){
					$age1.hide();$age2.hide();$age3.hide();
				}
				if(childNum==1){
					$age2.hide();$age3.hide();
					setTimeout(function(){
						$age1.show();
					},200);
				}
				if(childNum==2){
					$age3.hide();
					setTimeout(function(){
						$age1.show();$age2.show();
					},200);
				}
				if(childNum==3){
					setTimeout(function(){
						$age1.show();$age2.show();$age3.show();
					},200);
				}
			};

			$('.js-hotelPopup-people').on('click','.js-hotelChild-add',function(e){
				var childNum = $(this).siblings('span').html();
				childNum++;
				
				if(childNum==1){
					$(this).siblings('.sub-people').removeClass('off-sub-operation');
					$(this).parent().removeClass('disable');
				}
				if(childNum>2){
					childNum=3
					$(this).addClass('off-add-operation');
				}
				$(this).siblings('span').html(childNum);

				//动态赋值
				var spanVal = 0;
				var spanArray = $('.js-hotelChild-num');
				$.each(spanArray,function(idx, val) {
					spanVal+=Number($(val).html());
				});
				$childResult.html(spanVal); 

				// 动态增减年龄
				var that = $(this);
				changeAge(that,childNum);
			});
			$('.js-hotelPopup-people').on('click','.js-hotelChild-sub',function(e){
				var childNum = $(this).siblings('span').html();
				childNum--;
				if(childNum<1){
					childNum=0;
					$(this).addClass('off-sub-operation');
					$(this).parent().addClass('disable');
				}
				$(this).siblings('.add-people').removeClass('off-add-operation');
				$(this).siblings('span').html(childNum);
				
				var spanVal = 0;
				var spanArray = $('.js-hotelChild-num');
				$.each(spanArray,function(idx, val) {
					spanVal+=Number($(val).html());
				});
				$childResult.html(spanVal); 

				// 动态增减年龄
				var that = $(this);
				changeAge(that,childNum);
			});
		};

		adult();
		child();
	},

	/* 其他事件 */
	otherEvent:function(){
		/* 首屏自适应高度 */
		var winHeight = $(window).height();
		$('.js-section-main').height(437);
		$('.js-aside-code').height(winHeight-50);

		/* 首页页脚增加class */
		$('.lm-footer').addClass('lm-main-footer');

		/* 文字滚动 */
		var slideUp = function(){
			var docthis = $(".js-important-line");
			//默认参数
			value=$.extend({
				"li_h":"26",
				"time":3000,
				"movetime":1000
			});
			
			//向上滑动动画
			function autoani(){
				$(".js-important-line li:first").animate({"margin-top":-value.li_h},value.movetime,function(){
					$(this).css("margin-top",0).appendTo(".js-important-line");
				});
			}
			
			//自动间隔时间向上滑动
			var anifun = setInterval(autoani,value.time);
			
			//悬停时停止滑动，离开时继续执行
			$(docthis).children("li").hover(function(){
				clearInterval(anifun);			//清除自动滑动动画
			},function(){
				anifun = setInterval(autoani,value.time);	//继续执行动画
			});
		};
		// slideUp();

		/* 语言选择 */
		var $langMenu = $('.js-lang-menu');
		$('.js-h-lang').mouseenter(function(event) {
			$langMenu.show();
		}).mouseleave(function(event) {
			$langMenu.hide();
		});
		$('.js-choose-lang').click(function(e) {
			e.stopPropagation();
			$('.js-lang-menu').show();
		});

		/* 电话 */
		var $phoneMenu = $('.js-phone-menu');
		$('.js-h-phone').mouseenter(function(event) {
			$phoneMenu.show();
		}).mouseleave(function(event) {
			$phoneMenu.hide();
		});
		$('.js-h-phone').click(function(e) {
			e.stopPropagation();
			$('.js-phone-menu').show();
		});
		$('html').click(function(event) {
			$('.js-lang-menu').hide();
			$('.js-phone-menu').hide();
		});
	},
};

$(function() {
	LanmeiAirlines.init();
	$('.lm-loading').fadeOut('slow');
});