module.exports = {
    grabContentFrom: function(content, type) {
        var sampleIndex = content.indexOf('/* sample */');
        var componentIndex = content.indexOf('/* component */');
        var js, sample, component;
        if (Math.max(sampleIndex, componentIndex) != -1) {
            var contentLength = content.length;
            var index = Math.min(sampleIndex, componentIndex) != -1 ? Math.min(sampleIndex, componentIndex) : Math.max(sampleIndex, componentIndex);
            js = content.slice(0, index);
            if (sampleIndex != -1) {
                index = componentIndex != -1 ? Math.min(componentIndex, contentLength) : contentLength;
                sample = content.slice(sampleIndex + 12, index);
            }
            if (componentIndex != -1) {
                component = content.slice(componentIndex + 15, contentLength);
            }
        } else {
            js = content;
        }
        if (type === 'sample') {
            return sample;
        } else if (type === 'component') {
            return component;
        }
        return js;
    }
};