/*
    图片懒加载插件简易实现 window.ImageLazy.init({});
 */

(function (env) {

    env.ImageLazy = {
        init: initImageLazy
    };

    var defaultOptions = {
        errorImageUrl: null,
        loadingImageUrl: null,
        timeout: 150,
        scroll: env,
    };

    var allLazyImageList = null;

    function ImageLazyLoaderUIClass(options) {
        this.init(options);
    }

    // 初始化相关参数
    ImageLazyLoaderUIClass.prototype.init = function (options) {
        this.initParams(options);
        this.initHandlers();
        this.TimerScroll(); // 这边添加一次滚动效果,以防初始化时出现首图不出现的问题
    }

    ImageLazyLoaderUIClass.prototype.initParams = function (options) {
        var options = this.options = $.extend({}, defaultOptions, options);
        this.$scroll = $(this.options.scroll);

    }

    ImageLazyLoaderUIClass.prototype.initHandlers = function () {
        this.$scroll.bind('scroll.lazyImg', this.TimerScroll.bind(this));
    }

    ImageLazyLoaderUIClass.prototype.TimerScroll = function (ev) {
        clearInterval(this.timer);
        this.timer = setTimeout(this.scrolling.bind(this), this.options.timeout);
    }

    ImageLazyLoaderUIClass.prototype.scrolling = function () {
        var $images = this.getInclientViewImages();
        this.imageLoad($images);
        if (allLazyImageList.length < 1) {
            this.destory();
        }
    }

    ImageLazyLoaderUIClass.prototype.destory = function(){
        this.$scroll.unbind('scroll.lazyImg');
        imageLazyInstance = allLazyImageList = null;
    }


    // 初始化全部的图片列表
    ImageLazyLoaderUIClass.prototype.tryInitImageList = function () {
        if (!allLazyImageList) {
            allLazyImageList = [];
            var images = document.images; //用这种方式获取图片速度会比较快
            for (var i = 0, k = images.length; i < k; i++) {
                var thisImage = images[i];
                var dataSrc = thisImage.getAttribute('data-src');
                var ignore = thisImage.getAttribute('data-ignore');
                if (dataSrc) {
                    thisImage.classList.add('lazy-loading');
                }
                if (dataSrc && ignore !== 'true') {
                    allLazyImageList.push(thisImage);
                }
            }
        }
    }

    // 获取当前可视区域的所有图片
    ImageLazyLoaderUIClass.prototype.getInclientViewImages = function () {
        this.tryInitImageList();
        var images = allLazyImageList,
            newImageList = [], img,
            readyImgList = [];
        for (var i = 0, k = images.length; i < k; i++) {
            img = images[i];
            if (!img.parentElement) {
                continue;
            }
            if (this.isInClientView(img)) {
                readyImgList.push(img);
            } else {
                newImageList.push(img);
            }
        }
        allLazyImageList = newImageList;
        return $(readyImgList);
    }

    // 判断当前图片是否进入当前浏览器视窗内
    ImageLazyLoaderUIClass.prototype.isInClientView = function(element){
        var rect = element.getBoundingClientRect();
        var wRect = this.getWindowBoundingClientRect();
        return rect.top >= 0 && rect.top <= wRect.bottom;
    }

    // 自定义window元素的getBoundingClientVersion

    ImageLazyLoaderUIClass.prototype.getWindowBoundingClientRect = function(){
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return {top: 0, left: 0,right: windowWidth, bottom: windowHeight};
    }

    ImageLazyLoaderUIClass.prototype.imageLoad = function($images){
        $images.each(this.doImageItem.bind(this));
    };

    ImageLazyLoaderUIClass.prototype.doImageItem = function(index,item){
        var thisImage = $(item);
        var url = thisImage.data('src');
        var self = this;
        if (url) {
            thisImage.data('src',null);
            thisImage.addClass('lazy-loading');
            thisImage.onload = function(){
                self.success(thisImage);
            }

            thisImage.onerror = function(){
                self.error(thisImage);
            }
        }
        thisImage.attr('src',url);
    }

    ImageLazyLoaderUIClass.prototype.success = function(img){
        img.onload = img.onerror = null;
        img.removeClass('lazy-loading');
    }

    ImageLazyLoaderUIClass.prototype.error = function(img){
        var url = this.options.errorImageUrl;

        if (url) {
            img.attr('src',url);
        }

        this.onload = this.onerror = null;
        img.removeClass('lazy-loading');
    }

    var imageLazyInstance = null;
    // 初始化图片懒加载插件
    function initImageLazy(options) {
        if (!imageLazyInstance) {
            imageLazyInstance = new ImageLazyLoaderUIClass(options);
        }
        return imageLazyInstance;
    }
}(window));