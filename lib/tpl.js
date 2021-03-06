define(['jquery'], function ($) {
    return {
        load: function (name, req, load, config) {
            $.ajax({
                url: (config.baseUrl || '') + name,
                success: function (htmlString) {
                    var fileName = name.split('/').pop(),
                        templateId = fileName.replace(/\.[^\.]*$/, ''), // Strip extension
                        existingScriptElement = document.getElementById(templateId);

                    if (existingScriptElement) {
                        throw new Error("tpl plugin for require.js: More than one of the loaded templates have the file name " + fileName + ", skipped " + name + ". Please disambiguate by changing at least one of the file names.");
                    } else {
                        // Translate the template if AssetGraph-builder's bootstrapper script is present and we're not using the default language:
                        if (window.TRHTML && (!window.DEFAULTLOCALEID || LOCALEID !== DEFAULTLOCALEID) && window.TRANSLATE !== false) {
                            htmlString = TRHTML(htmlString);
                        }
                        var scriptElement = document.createElement('script');
                        scriptElement.setAttribute('type', 'text/html');
                        scriptElement.setAttribute('id', templateId);
                        if ('textContent' in scriptElement) {
                            scriptElement.textContent = htmlString;
                        } else {
                            // IE8 and below
                            scriptElement.text = htmlString;
                        }
                        document.body.appendChild(scriptElement);
                    }
                    load(htmlString);
                }
            });
        }
    };
});
