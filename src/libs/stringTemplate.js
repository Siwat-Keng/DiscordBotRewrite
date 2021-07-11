const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g

const stringTemplateParser = (expression, valueObj) => expression
    .replace(templateMatcher, (substring, value, index) => valueObj[value])

const embedTemplateParser = (embed, valueObj) => 
{
    embed.title = embed.title && stringTemplateParser(embed.title, valueObj)
    embed.description = embed.description && stringTemplateParser(embed.description, valueObj)
    if (embed.footer)
        embed.footer.text = embed.footer?.text && stringTemplateParser(embed.footer.text, valueObj)
    embed.fields = embed.fields?.map(field => 
        ({
            name: stringTemplateParser(field.name, valueObj),
            value: stringTemplateParser(field.value, valueObj),
        }),
    )
    return embed
}

module.exports = { stringTemplateParser, embedTemplateParser }