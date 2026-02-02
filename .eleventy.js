const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // 排除模板目录，避免非标准YAML语法导致构建错误
  eleventyConfig.ignores.add('_templates/');

    // 设置输入目录 (你的网站内容所在)
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("assets"); // 如果有图片等资源

    // 添加 commPosts 集合
    eleventyConfig.addCollection('commPosts', function(collectionApi) {
        return collectionApi.getFilteredByGlob('_comm_posts/*.md');
    });

    // 添加 posts 集合
    eleventyConfig.addCollection('posts', function(collectionApi) {
        return collectionApi.getFilteredByGlob('_posts/*.md').sort((a, b) => {
            return new Date(a.data.date) - new Date(b.data.date);
        });
    });

    eleventyConfig.addCollection('allCommTags', function(collectionApi) {
        let tags = new Set();
        const commPosts = collectionApi.getFilteredByGlob('_comm_posts/*.md');
        for (let item of commPosts) {
            if (item.data.tags) {
                if (Array.isArray(item.data.tags)) {
                    for (let tag of item.data.tags) {
                        tags.add(tag);
                    }
                } else if (typeof item.data.tags === 'string') {
                    tags.add(item.data.tags);
                }
            }
        }
        return Array.from(tags).sort().map(tag => ({ tag: tag }));
    });

    // 添加日期格式化过滤器
    eleventyConfig.addFilter("date", (dateObj, format) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
    });

    // 获取上一篇文章
    eleventyConfig.addFilter("getPreviousCollectionItem", (collection, currentItemUrl) => {
        if (!collection || !currentItemUrl) {
            return null;
        }
        // collection is already sorted by date in eleventyConfig.addCollection('posts')
        const currentIndex = collection.findIndex(item => item.url === currentItemUrl);
        return currentIndex > 0 ? collection[currentIndex - 1] : null;
    });

    // 获取下一篇文章
    eleventyConfig.addFilter("getNextCollectionItem", (collection, currentItemUrl) => {
        if (!collection || !currentItemUrl) {
            return null;
        }
        // collection is already sorted by date in eleventyConfig.addCollection('posts')
        const currentIndex = collection.findIndex(item => item.url === currentItemUrl);
        return currentIndex < collection.length - 1 ? collection[currentIndex + 1] : null;
    });

    // 添加获取所有标签的过滤器
    eleventyConfig.addFilter("getAllTags", collection => {
        let tags = new Set();
        for (let item of collection) {
            if ("tags" in item.data) {
                for (let tag of item.data.tags) {
                    const trimmedTag = tag.trim(); // Trim whitespace
                    if (trimmedTag) { // Only add non-empty tags
                        tags.add(trimmedTag);
                    }
                }
            }
        }
        return Array.from(tags).sort();
    });

    // 添加 slug 过滤器
    eleventyConfig.addFilter("slug", text => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')          // Replace multiple - with single -
            .replace(/^-+/, '')            // Trim - from start of text
            .replace(/-+$/, '');           // Trim - from end of text
    });

    // 添加自定义 slug 过滤器
    eleventyConfig.addFilter("customSlug", function(value) {
        return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
    });

    // 添加 excerpt 过滤器 (简单的截取前100个字符)
    eleventyConfig.addFilter("excerpt", content => {
        if (!content) return "";
        const stripHtml = content.replace(/<[^>]*>?/gm, ''); // 移除HTML标签
        return stripHtml.substring(0, 100) + (stripHtml.length > 100 ? '...' : '');
    });


    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes", // 模板片段，例如布局文件
            data: "_data" // 全局数据文件
        },
        templateFormats: ["md", "html", "njk"],
        markdownTemplateEngine: "njk", // 让Markdown文件可以使用Nunjucks模板
        htmlTemplateEngine: "njk", // 让HTML文件可以使用Nunjucks模板
        dataTemplateEngine: "njk"
    };
};