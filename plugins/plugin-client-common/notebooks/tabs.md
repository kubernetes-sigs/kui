# Tabs

Sections starting with a `=== "Tab name"` will be rendered as tabs,
with the tab content indented by at least 4 spaces. 

**Warning**: due to the vagaries of the Markdown syntax, make sure to
have a newline separating the tab start and tab content, and also
between tabs.

???+ tip "Tab Example"

    > Note how we are using tabs and hints nested inside of an expandable section!

    === "Output"
        
        === "Tab 1"
    
            Markdown **content**.

            Multiple paragraphs.

        === "Tab 2"

            More Markdown **content**.

            - list item a
            - list item b

    === "Markdown"

        ```
        === "Tab 1"

            Markdown **content**.

            Multiple paragraphs.

        === "Tab 2"

            More Markdown **content**.

            - list item a
            - list item b
        ```
