const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            "@primary-color": "#B21919",
                            "@table-header-bg": "#8f8f8f",
                            "@table-header-color": "#ffffff",
                            "@table-border-radius-base": "5px",
                            "@border-radius-base": "5px",
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
