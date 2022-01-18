[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/test](kui_shell_test.md) / Selectors

# Namespace: Selectors

[@kui-shell/test](kui_shell_test.md).Selectors

## Table of contents

### Variables

- [BLOCK_CLOSE_BUTTON](kui_shell_test.Selectors.md#block_close_button)
- [BLOCK_UNPIN_BUTTON](kui_shell_test.Selectors.md#block_unpin_button)
- [BOTTOM_PROMPT](kui_shell_test.Selectors.md#bottom_prompt)
- [BOTTOM_PROMPT_BLOCK](kui_shell_test.Selectors.md#bottom_prompt_block)
- [COMMENTARY_EDITOR](kui_shell_test.Selectors.md#commentary_editor)
- [COMMENTARY_EDITOR_BUTTON_CANCEL](kui_shell_test.Selectors.md#commentary_editor_button_cancel)
- [COMMENTARY_EDITOR_BUTTON_DONE](kui_shell_test.Selectors.md#commentary_editor_button_done)
- [COMMENTARY_EDITOR_BUTTON_REVERT](kui_shell_test.Selectors.md#commentary_editor_button_revert)
- [CONFIRM_DIALOG](kui_shell_test.Selectors.md#confirm_dialog)
- [CONFIRM_DIALOG_CANCEL_BUTTON](kui_shell_test.Selectors.md#confirm_dialog_cancel_button)
- [CONFIRM_DIALOG_CONFIRM_BUTTON](kui_shell_test.Selectors.md#confirm_dialog_confirm_button)
- [CURRENT_MULTI_LINE_PROMPT](kui_shell_test.Selectors.md#current_multi_line_prompt)
- [CURRENT_PROMPT](kui_shell_test.Selectors.md#current_prompt)
- [CURRENT_PROMPT_BLOCK](kui_shell_test.Selectors.md#current_prompt_block)
- [CURRENT_TAB](kui_shell_test.Selectors.md#current_tab)
- [CURRENT_TAB_CLOSE](kui_shell_test.Selectors.md#current_tab_close)
- [CURRENT_TAB_TITLE](kui_shell_test.Selectors.md#current_tab_title)
- [DLIST](kui_shell_test.Selectors.md#dlist)
- [DROPDOWN](kui_shell_test.Selectors.md#dropdown)
- [EXPERIMENTAL_PROMPT_BLOCK_TAG](kui_shell_test.Selectors.md#experimental_prompt_block_tag)
- [INVERTED_COLORS](kui_shell_test.Selectors.md#inverted_colors)
- [LIST_RESULT_FIRST](kui_shell_test.Selectors.md#list_result_first)
- [Markdown](kui_shell_test.Selectors.md#markdown)
- [NEW_SPLIT_BUTTON](kui_shell_test.Selectors.md#new_split_button)
- [N_ATTR](kui_shell_test.Selectors.md#n_attr)
- [OOPS](kui_shell_test.Selectors.md#oops)
- [OUTPUT_LAST](kui_shell_test.Selectors.md#output_last)
- [OUTPUT_LAST_PTY](kui_shell_test.Selectors.md#output_last_pty)
- [OUTPUT_LAST_STREAMING](kui_shell_test.Selectors.md#output_last_streaming)
- [OUTPUT_LAST_STREAMING_IN_NOTEBOOK](kui_shell_test.Selectors.md#output_last_streaming_in_notebook)
- [OVERFLOW_MENU](kui_shell_test.Selectors.md#overflow_menu)
- [PROCESSING_PROMPT_BLOCK](kui_shell_test.Selectors.md#processing_prompt_block)
- [PROMPT_BLOCK](kui_shell_test.Selectors.md#prompt_block)
- [PROMPT_BLOCK_FINAL](kui_shell_test.Selectors.md#prompt_block_final)
- [PROMPT_BLOCK_LAST](kui_shell_test.Selectors.md#prompt_block_last)
- [PROMPT_FINAL](kui_shell_test.Selectors.md#prompt_final)
- [PROMPT_LAST](kui_shell_test.Selectors.md#prompt_last)
- [RADIO_BUTTON](kui_shell_test.Selectors.md#radio_button)
- [RADIO_BUTTON_IS_SELECTED](kui_shell_test.Selectors.md#radio_button_is_selected)
- [RADIO_BUTTON_SELECTED](kui_shell_test.Selectors.md#radio_button_selected)
- [SIDECAR_LAST](kui_shell_test.Selectors.md#sidecar_last)
- [SIDECAR_TOOLBAR_LAST](kui_shell_test.Selectors.md#sidecar_toolbar_last)
- [SPLITS](kui_shell_test.Selectors.md#splits)
- [SPLIT_ID](kui_shell_test.Selectors.md#split_id)
- [STATUS_STRIPE](kui_shell_test.Selectors.md#status_stripe)
- [STATUS_STRIPE_BLOCK](kui_shell_test.Selectors.md#status_stripe_block)
- [STATUS_STRIPE_MESSAGE](kui_shell_test.Selectors.md#status_stripe_message)
- [STATUS_STRIPE_PROMPT](kui_shell_test.Selectors.md#status_stripe_prompt)
- [Sidebar](kui_shell_test.Selectors.md#sidebar)
- [TAB_CONTENT](kui_shell_test.Selectors.md#tab_content)
- [TERMINAL_CARD](kui_shell_test.Selectors.md#terminal_card)
- [TERMINAL_CARD_BODY](kui_shell_test.Selectors.md#terminal_card_body)
- [TERMINAL_CARD_TITLE](kui_shell_test.Selectors.md#terminal_card_title)
- [TOP_TAB](kui_shell_test.Selectors.md#top_tab)
- [WELCOME_BLOCK](kui_shell_test.Selectors.md#welcome_block)
- [\_PROMPT_BLOCK](kui_shell_test.Selectors.md#_prompt_block)
- [\_RESULT](kui_shell_test.Selectors.md#_result)
- [\_SIDECAR](kui_shell_test.Selectors.md#_sidecar)
- [\_TABLE_AS_GRID](kui_shell_test.Selectors.md#_table_as_grid)
- [\_TABLE_EMPTY](kui_shell_test.Selectors.md#_table_empty)
- [tabButtonSelector](kui_shell_test.Selectors.md#tabbuttonselector)

### Functions

- [ALT_BUFFER_N](kui_shell_test.Selectors.md#alt_buffer_n)
- [BLOCK_DOWN_BUTTON](kui_shell_test.Selectors.md#block_down_button)
- [BLOCK_LINK_BUTTON](kui_shell_test.Selectors.md#block_link_button)
- [BLOCK_REMOVE_BUTTON](kui_shell_test.Selectors.md#block_remove_button)
- [BLOCK_SECTION_BUTTON](kui_shell_test.Selectors.md#block_section_button)
- [BLOCK_UP_BUTTON](kui_shell_test.Selectors.md#block_up_button)
- [BY_KEY](kui_shell_test.Selectors.md#by_key)
- [BY_NAME](kui_shell_test.Selectors.md#by_name)
- [COMMAND_COPY_BUTTON](kui_shell_test.Selectors.md#command_copy_button)
- [COMMAND_COPY_DONE_BUTTON](kui_shell_test.Selectors.md#command_copy_done_button)
- [COMMAND_RERUN_BUTTON](kui_shell_test.Selectors.md#command_rerun_button)
- [CURRENT_GRID_BY_NAME_FOR_SPLIT](kui_shell_test.Selectors.md#current_grid_by_name_for_split)
- [CURRENT_GRID_FOR_SPLIT](kui_shell_test.Selectors.md#current_grid_for_split)
- [CURRENT_GRID_OFFLINE_FOR_SPLIT](kui_shell_test.Selectors.md#current_grid_offline_for_split)
- [CURRENT_GRID_ONLINE_FOR_SPLIT](kui_shell_test.Selectors.md#current_grid_online_for_split)
- [CURRENT_PROMPT_BLOCK_FOR_SPLIT](kui_shell_test.Selectors.md#current_prompt_block_for_split)
- [CURRENT_PROMPT_FOR_SPLIT](kui_shell_test.Selectors.md#current_prompt_for_split)
- [DLIST_DESCRIPTION_FOR](kui_shell_test.Selectors.md#dlist_description_for)
- [DROPDOWN_MENU_ITEM_NAMED](kui_shell_test.Selectors.md#dropdown_menu_item_named)
- [DROPDOWN_N](kui_shell_test.Selectors.md#dropdown_n)
- [DROPDOWN_N_MENU_ITEM](kui_shell_test.Selectors.md#dropdown_n_menu_item)
- [EXPANDABLE_OUTPUT_LAST](kui_shell_test.Selectors.md#expandable_output_last)
- [EXPANDABLE_OUTPUT_LAST_IN_NOTEBOOK](kui_shell_test.Selectors.md#expandable_output_last_in_notebook)
- [EXPANDABLE_OUTPUT_N](kui_shell_test.Selectors.md#expandable_output_n)
- [GRID_CELL_BY_NAME](kui_shell_test.Selectors.md#grid_cell_by_name)
- [LIST_RESULTS_BY_NAME_N](kui_shell_test.Selectors.md#list_results_by_name_n)
- [LIST_RESULTS_N](kui_shell_test.Selectors.md#list_results_n)
- [LIST_RESULT_BY_N_AND_NAME](kui_shell_test.Selectors.md#list_result_by_n_and_name)
- [LIST_RESULT_BY_N_FOR_NAME](kui_shell_test.Selectors.md#list_result_by_n_for_name)
- [OK_N](kui_shell_test.Selectors.md#ok_n)
- [OUTPUT_LAST_FOR_SPLIT](kui_shell_test.Selectors.md#output_last_for_split)
- [OUTPUT_LAST_FOR_SPLIT_IN_NOTEBOOK](kui_shell_test.Selectors.md#output_last_for_split_in_notebook)
- [OUTPUT_LAST_IN_NOTEBOOK](kui_shell_test.Selectors.md#output_last_in_notebook)
- [OUTPUT_LAST_PTY_IN_NOTEBOOK](kui_shell_test.Selectors.md#output_last_pty_in_notebook)
- [OUTPUT_N](kui_shell_test.Selectors.md#output_n)
- [OUTPUT_N_PTY](kui_shell_test.Selectors.md#output_n_pty)
- [OUTPUT_N_STREAMING](kui_shell_test.Selectors.md#output_n_streaming)
- [POPOVER_SELECT_OPTION](kui_shell_test.Selectors.md#popover_select_option)
- [PROCESSING_N](kui_shell_test.Selectors.md#processing_n)
- [PROMPT_BLOCK_FOR_SPLIT](kui_shell_test.Selectors.md#prompt_block_for_split)
- [PROMPT_BLOCK_LAST_FOR_SPLIT](kui_shell_test.Selectors.md#prompt_block_last_for_split)
- [PROMPT_BLOCK_LAST_FOR_SPLIT_IN_NOTEBOOK](kui_shell_test.Selectors.md#prompt_block_last_for_split_in_notebook)
- [PROMPT_BLOCK_LAST_IN_NOTEBOOK](kui_shell_test.Selectors.md#prompt_block_last_in_notebook)
- [PROMPT_BLOCK_MENU](kui_shell_test.Selectors.md#prompt_block_menu)
- [PROMPT_BLOCK_N](kui_shell_test.Selectors.md#prompt_block_n)
- [PROMPT_BLOCK_N_FOR_SPLIT](kui_shell_test.Selectors.md#prompt_block_n_for_split)
- [PROMPT_CONTEXT_N](kui_shell_test.Selectors.md#prompt_context_n)
- [PROMPT_LAST_IN_NOTEBOOK](kui_shell_test.Selectors.md#prompt_last_in_notebook)
- [PROMPT_N](kui_shell_test.Selectors.md#prompt_n)
- [PROMPT_N_FOR_SPLIT](kui_shell_test.Selectors.md#prompt_n_for_split)
- [RADIO_BUTTON_BY_NAME](kui_shell_test.Selectors.md#radio_button_by_name)
- [SIDECAR](kui_shell_test.Selectors.md#sidecar)
- [SIDECAR_ACTIVATION_TITLE](kui_shell_test.Selectors.md#sidecar_activation_title)
- [SIDECAR_ALERT](kui_shell_test.Selectors.md#sidecar_alert)
- [SIDECAR_BACK_BUTTON](kui_shell_test.Selectors.md#sidecar_back_button)
- [SIDECAR_BACK_BUTTON_DISABLED](kui_shell_test.Selectors.md#sidecar_back_button_disabled)
- [SIDECAR_BADGES](kui_shell_test.Selectors.md#sidecar_badges)
- [SIDECAR_BASE](kui_shell_test.Selectors.md#sidecar_base)
- [SIDECAR_BREADCRUMBS](kui_shell_test.Selectors.md#sidecar_breadcrumbs)
- [SIDECAR_CLOSE_BUTTON](kui_shell_test.Selectors.md#sidecar_close_button)
- [SIDECAR_CONTENT](kui_shell_test.Selectors.md#sidecar_content)
- [SIDECAR_CUSTOM_CONTENT](kui_shell_test.Selectors.md#sidecar_custom_content)
- [SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS](kui_shell_test.Selectors.md#sidecar_custom_content_line_numbers)
- [SIDECAR_FORWARD_BUTTON](kui_shell_test.Selectors.md#sidecar_forward_button)
- [SIDECAR_FORWARD_BUTTON_DISABLED](kui_shell_test.Selectors.md#sidecar_forward_button_disabled)
- [SIDECAR_FULLY_CLOSED](kui_shell_test.Selectors.md#sidecar_fully_closed)
- [SIDECAR_FULLY_CLOSE_BUTTON](kui_shell_test.Selectors.md#sidecar_fully_close_button)
- [SIDECAR_HEADER_NAVIGATION](kui_shell_test.Selectors.md#sidecar_header_navigation)
- [SIDECAR_HERO_TITLE](kui_shell_test.Selectors.md#sidecar_hero_title)
- [SIDECAR_KIND](kui_shell_test.Selectors.md#sidecar_kind)
- [SIDECAR_LEFTNAV](kui_shell_test.Selectors.md#sidecar_leftnav)
- [SIDECAR_LEFTNAV_NAV](kui_shell_test.Selectors.md#sidecar_leftnav_nav)
- [SIDECAR_LEFTNAV_TITLE](kui_shell_test.Selectors.md#sidecar_leftnav_title)
- [SIDECAR_MODE_BUTTON](kui_shell_test.Selectors.md#sidecar_mode_button)
- [SIDECAR_MODE_BUTTONS](kui_shell_test.Selectors.md#sidecar_mode_buttons)
- [SIDECAR_MODE_BUTTONS_V2](kui_shell_test.Selectors.md#sidecar_mode_buttons_v2)
- [SIDECAR_MODE_BUTTON_SELECTED](kui_shell_test.Selectors.md#sidecar_mode_button_selected)
- [SIDECAR_MODE_BUTTON_SELECTED_V2](kui_shell_test.Selectors.md#sidecar_mode_button_selected_v2)
- [SIDECAR_MODE_BUTTON_V2](kui_shell_test.Selectors.md#sidecar_mode_button_v2)
- [SIDECAR_NAV_COMMAND_LINKS](kui_shell_test.Selectors.md#sidecar_nav_command_links)
- [SIDECAR_NAV_HREF_LINKS](kui_shell_test.Selectors.md#sidecar_nav_href_links)
- [SIDECAR_PACKAGE_NAME_TITLE](kui_shell_test.Selectors.md#sidecar_package_name_title)
- [SIDECAR_PACKAGE_PARAMETERS](kui_shell_test.Selectors.md#sidecar_package_parameters)
- [SIDECAR_POPUP_HERO_TITLE](kui_shell_test.Selectors.md#sidecar_popup_hero_title)
- [SIDECAR_POPUP_TITLE](kui_shell_test.Selectors.md#sidecar_popup_title)
- [SIDECAR_RESUME_FROM_CLOSE_BUTTON](kui_shell_test.Selectors.md#sidecar_resume_from_close_button)
- [SIDECAR_TAB_CONTENT](kui_shell_test.Selectors.md#sidecar_tab_content)
- [SIDECAR_TITLE](kui_shell_test.Selectors.md#sidecar_title)
- [SIDECAR_TOOLBAR](kui_shell_test.Selectors.md#sidecar_toolbar)
- [SIDECAR_TOOLBAR_BUTTON](kui_shell_test.Selectors.md#sidecar_toolbar_button)
- [SIDECAR_TOOLBAR_BUTTON_LAST](kui_shell_test.Selectors.md#sidecar_toolbar_button_last)
- [SIDECAR_TOOLBAR_TEXT](kui_shell_test.Selectors.md#sidecar_toolbar_text)
- [SIDECAR_TOOLBAR_TEXT_LAST](kui_shell_test.Selectors.md#sidecar_toolbar_text_last)
- [SIDECAR_WEB_ACTION_URL](kui_shell_test.Selectors.md#sidecar_web_action_url)
- [SIDECAR_WITH_FAILURE](kui_shell_test.Selectors.md#sidecar_with_failure)
- [SOURCE_REF_N](kui_shell_test.Selectors.md#source_ref_n)
- [SOURCE_REF_TOGGLE_N](kui_shell_test.Selectors.md#source_ref_toggle_n)
- [SPLIT_BOTTOM](kui_shell_test.Selectors.md#split_bottom)
- [SPLIT_DEFAULT](kui_shell_test.Selectors.md#split_default)
- [SPLIT_LEFT](kui_shell_test.Selectors.md#split_left)
- [SPLIT_N](kui_shell_test.Selectors.md#split_n)
- [SPLIT_N_AS_BOTTOM_STRIP](kui_shell_test.Selectors.md#split_n_as_bottom_strip)
- [SPLIT_N_AS_DEFAULT](kui_shell_test.Selectors.md#split_n_as_default)
- [SPLIT_N_AS_LEFT_STRIP](kui_shell_test.Selectors.md#split_n_as_left_strip)
- [SPLIT_N_CLEAR](kui_shell_test.Selectors.md#split_n_clear)
- [SPLIT_N_CLOSE](kui_shell_test.Selectors.md#split_n_close)
- [SPLIT_N_FOCUS](kui_shell_test.Selectors.md#split_n_focus)
- [SPLIT_N_HEADER](kui_shell_test.Selectors.md#split_n_header)
- [SPLIT_N_MENU](kui_shell_test.Selectors.md#split_n_menu)
- [SPLIT_N_OUTPUT](kui_shell_test.Selectors.md#split_n_output)
- [SPLIT_N_POSITION_TOGGLE](kui_shell_test.Selectors.md#split_n_position_toggle)
- [STATUS_STRIPE_DROPDOWN_LABEL](kui_shell_test.Selectors.md#status_stripe_dropdown_label)
- [STATUS_STRIPE_TYPE](kui_shell_test.Selectors.md#status_stripe_type)
- [STATUS_STRIPE_WIDGET](kui_shell_test.Selectors.md#status_stripe_widget)
- [STATUS_STRIPE_WIDGET_ICON_WITH_ATTR](kui_shell_test.Selectors.md#status_stripe_widget_icon_with_attr)
- [STATUS_STRIPE_WIDGET_LABEL](kui_shell_test.Selectors.md#status_stripe_widget_label)
- [STATUS_STRIPE_WIDGET_LABEL_WITH_ATTR](kui_shell_test.Selectors.md#status_stripe_widget_label_with_attr)
- [STATUS_STRIPE_WIDGET_WITH_ATTR](kui_shell_test.Selectors.md#status_stripe_widget_with_attr)
- [TABLE_AS_GRID](kui_shell_test.Selectors.md#table_as_grid)
- [TABLE_AS_GRID_CELL](kui_shell_test.Selectors.md#table_as_grid_cell)
- [TABLE_AS_GRID_CELL_GREEN](kui_shell_test.Selectors.md#table_as_grid_cell_green)
- [TABLE_AS_GRID_CELL_RED](kui_shell_test.Selectors.md#table_as_grid_cell_red)
- [TABLE_AS_LIST](kui_shell_test.Selectors.md#table_as_list)
- [TABLE_AS_SEQUENCE](kui_shell_test.Selectors.md#table_as_sequence)
- [TABLE_AS_SEQUENCE_BAR](kui_shell_test.Selectors.md#table_as_sequence_bar)
- [TABLE_AS_SEQUENCE_BAR_WIDTH](kui_shell_test.Selectors.md#table_as_sequence_bar_width)
- [TABLE_CELL](kui_shell_test.Selectors.md#table_cell)
- [TABLE_FOOTER](kui_shell_test.Selectors.md#table_footer)
- [TABLE_FOOTER_MESSAGE](kui_shell_test.Selectors.md#table_footer_message)
- [TABLE_FOOTER_MESSAGE_LINK](kui_shell_test.Selectors.md#table_footer_message_link)
- [TABLE_HEADER_CELL](kui_shell_test.Selectors.md#table_header_cell)
- [TABLE_HISTOGRAM_TEXT](kui_shell_test.Selectors.md#table_histogram_text)
- [TABLE_HISTOGRAM_TEXT_WITH_ID](kui_shell_test.Selectors.md#table_histogram_text_with_id)
- [TABLE_PAGINATION_BACKWARD](kui_shell_test.Selectors.md#table_pagination_backward)
- [TABLE_PAGINATION_FORWARD](kui_shell_test.Selectors.md#table_pagination_forward)
- [TABLE_SHOW_AS_GRID](kui_shell_test.Selectors.md#table_show_as_grid)
- [TABLE_SHOW_AS_HISTOGRAM](kui_shell_test.Selectors.md#table_show_as_histogram)
- [TABLE_SHOW_AS_LIST](kui_shell_test.Selectors.md#table_show_as_list)
- [TABLE_SHOW_AS_SEQUENCE](kui_shell_test.Selectors.md#table_show_as_sequence)
- [TABLE_TITLE](kui_shell_test.Selectors.md#table_title)
- [TABLE_TITLE_NROWS](kui_shell_test.Selectors.md#table_title_nrows)
- [TABLE_TITLE_SECONDARY](kui_shell_test.Selectors.md#table_title_secondary)
- [TAB_N](kui_shell_test.Selectors.md#tab_n)
- [TAB_SELECTED_N](kui_shell_test.Selectors.md#tab_selected_n)
- [TAB_TITLE_N](kui_shell_test.Selectors.md#tab_title_n)
- [TERMINAL_ALERT](kui_shell_test.Selectors.md#terminal_alert)
- [TOP_TAB_CLOSE_N](kui_shell_test.Selectors.md#top_tab_close_n)
- [TOP_TAB_N](kui_shell_test.Selectors.md#top_tab_n)
- [TOP_TAB_N_CLICKABLE](kui_shell_test.Selectors.md#top_tab_n_clickable)
- [TOP_TAB_WITH_TITLE](kui_shell_test.Selectors.md#top_tab_with_title)
- [WATCHER_CLOSE_BUTTON](kui_shell_test.Selectors.md#watcher_close_button)
- [WATCHER_N](kui_shell_test.Selectors.md#watcher_n)
- [WATCHER_N_CLOSE](kui_shell_test.Selectors.md#watcher_n_close)
- [WATCHER_N_DROPDOWN](kui_shell_test.Selectors.md#watcher_n_dropdown)
- [WATCHER_N_DROPDOWN_ITEM](kui_shell_test.Selectors.md#watcher_n_dropdown_item)
- [WATCHER_N_GRID_CELL](kui_shell_test.Selectors.md#watcher_n_grid_cell)
- [WATCHER_N_GRID_CELL_OFFLINE](kui_shell_test.Selectors.md#watcher_n_grid_cell_offline)
- [WATCHER_N_GRID_CELL_ONLINE](kui_shell_test.Selectors.md#watcher_n_grid_cell_online)
- [WATCHER_N_GRID_CELL_PENDING](kui_shell_test.Selectors.md#watcher_n_grid_cell_pending)
- [WATCHER_N_SHOW_AS_TABLE](kui_shell_test.Selectors.md#watcher_n_show_as_table)
- [WATCHER_N_TITLE](kui_shell_test.Selectors.md#watcher_n_title)
- [WATCH_LIVE_BUTTON](kui_shell_test.Selectors.md#watch_live_button)
- [WATCH_OFFLINE_BUTTON](kui_shell_test.Selectors.md#watch_offline_button)
- [\_PROMPT_BLOCK_N](kui_shell_test.Selectors.md#_prompt_block_n)
- [xtermRows](kui_shell_test.Selectors.md#xtermrows)

## Variables

### BLOCK_CLOSE_BUTTON

• **BLOCK_CLOSE_BUTTON**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:332](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L332)

---

### BLOCK_UNPIN_BUTTON

• **BLOCK_UNPIN_BUTTON**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:333](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L333)

---

### BOTTOM_PROMPT

• **BOTTOM_PROMPT**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:57](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L57)

---

### BOTTOM_PROMPT_BLOCK

• **BOTTOM_PROMPT_BLOCK**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:56](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L56)

---

### COMMENTARY_EDITOR

• **COMMENTARY_EDITOR**: `".kui--commentary .kui--source-ref-editor"`

#### Defined in

[packages/test/src/api/selectors.ts:375](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L375)

---

### COMMENTARY_EDITOR_BUTTON_CANCEL

• **COMMENTARY_EDITOR_BUTTON_CANCEL**: `".kui--commentary-editor-toolbar .kui--commentary-button.kui--commentary-cancel-button"`

#### Defined in

[packages/test/src/api/selectors.ts:369](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L369)

---

### COMMENTARY_EDITOR_BUTTON_DONE

• **COMMENTARY_EDITOR_BUTTON_DONE**: `".kui--commentary-editor-toolbar .kui--commentary-button.kui--commentary-done-button"`

#### Defined in

[packages/test/src/api/selectors.ts:371](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L371)

---

### COMMENTARY_EDITOR_BUTTON_REVERT

• **COMMENTARY_EDITOR_BUTTON_REVERT**: `".kui--commentary-editor-toolbar .kui--commentary-button.kui--commentary-revert-button"`

#### Defined in

[packages/test/src/api/selectors.ts:373](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L373)

---

### CONFIRM_DIALOG

• **CONFIRM_DIALOG**: `"#confirm-dialog"`

Confirm Dialog

#### Defined in

[packages/test/src/api/selectors.ts:392](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L392)

---

### CONFIRM_DIALOG_CANCEL_BUTTON

• **CONFIRM_DIALOG_CANCEL_BUTTON**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:394](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L394)

---

### CONFIRM_DIALOG_CONFIRM_BUTTON

• **CONFIRM_DIALOG_CONFIRM_BUTTON**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:393](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L393)

---

### CURRENT_MULTI_LINE_PROMPT

• **CURRENT_MULTI_LINE_PROMPT**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:52](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L52)

---

### CURRENT_PROMPT

• **CURRENT_PROMPT**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:51](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L51)

---

### CURRENT_PROMPT_BLOCK

• **CURRENT_PROMPT_BLOCK**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:46](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L46)

---

### CURRENT_TAB

• **CURRENT_TAB**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:30](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L30)

---

### CURRENT_TAB_CLOSE

• **CURRENT_TAB_CLOSE**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:32](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L32)

---

### CURRENT_TAB_TITLE

• **CURRENT_TAB_TITLE**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:31](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L31)

---

### DLIST

• **DLIST**: `".kui--description-list"`

DescriptionList

#### Defined in

[packages/test/src/api/selectors.ts:405](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L405)

---

### DROPDOWN

• **DROPDOWN**: `".kui--dropdown"`

dropdown

#### Defined in

[packages/test/src/api/selectors.ts:385](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L385)

---

### EXPERIMENTAL_PROMPT_BLOCK_TAG

• **EXPERIMENTAL_PROMPT_BLOCK_TAG**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:229](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L229)

---

### INVERTED_COLORS

• **INVERTED_COLORS**: `".kui--inverted-color-context"`

#### Defined in

[packages/test/src/api/selectors.ts:156](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L156)

---

### LIST_RESULT_FIRST

• **LIST_RESULT_FIRST**: `"tbody tr:first-child .clickable"`

#### Defined in

[packages/test/src/api/selectors.ts:298](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L298)

---

### Markdown

• **Markdown**: `default`

#### Defined in

[packages/test/src/api/selectors.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L21)

---

### NEW_SPLIT_BUTTON

• **NEW_SPLIT_BUTTON**: `"#kui--split-terminal-button"`

Terminal splits

#### Defined in

[packages/test/src/api/selectors.ts:162](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L162)

---

### N_ATTR

• **N_ATTR**: `"data-input-count"`

#### Defined in

[packages/test/src/api/selectors.ts:53](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L53)

---

### OOPS

• **OOPS**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:60](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L60)

---

### OUTPUT_LAST

• **OUTPUT_LAST**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:208](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L208)

---

### OUTPUT_LAST_PTY

• **OUTPUT_LAST_PTY**: `string` = `OUTPUT_LAST`

#### Defined in

[packages/test/src/api/selectors.ts:213](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L213)

---

### OUTPUT_LAST_STREAMING

• **OUTPUT_LAST_STREAMING**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:210](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L210)

---

### OUTPUT_LAST_STREAMING_IN_NOTEBOOK

• **OUTPUT_LAST_STREAMING_IN_NOTEBOOK**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:211](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L211)

---

### OVERFLOW_MENU

• **OVERFLOW_MENU**: `".kui--repl-block-right-element.kui--toolbar-button-with-icon"`

#### Defined in

[packages/test/src/api/selectors.ts:231](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L231)

---

### PROCESSING_PROMPT_BLOCK

• **PROCESSING_PROMPT_BLOCK**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:45](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L45)

---

### PROMPT_BLOCK

• **PROMPT_BLOCK**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:44](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L44)

---

### PROMPT_BLOCK_FINAL

• **PROMPT_BLOCK_FINAL**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:230](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L230)

---

### PROMPT_BLOCK_LAST

• **PROMPT_BLOCK_LAST**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:192](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L192)

---

### PROMPT_FINAL

• **PROMPT_FINAL**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:242](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L242)

---

### PROMPT_LAST

• **PROMPT_LAST**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:203](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L203)

---

### RADIO_BUTTON

• **RADIO_BUTTON**: `".kui--radio-table-body .kui--radio-table-row"`

Selectors of radio button (new RadioTable-based)

#### Defined in

[packages/test/src/api/selectors.ts:359](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L359)

---

### RADIO_BUTTON_IS_SELECTED

• **RADIO_BUTTON_IS_SELECTED**: `"[data-is-selected]"`

#### Defined in

[packages/test/src/api/selectors.ts:361](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L361)

---

### RADIO_BUTTON_SELECTED

• **RADIO_BUTTON_SELECTED**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:362](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L362)

---

### SIDECAR_LAST

• **SIDECAR_LAST**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:377](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L377)

---

### SIDECAR_TOOLBAR_LAST

• **SIDECAR_TOOLBAR_LAST**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:378](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L378)

---

### SPLITS

• **SPLITS**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:163](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L163)

---

### SPLIT_ID

• **SPLIT_ID**: `"data-scrollback-id"`

#### Defined in

[packages/test/src/api/selectors.ts:164](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L164)

---

### STATUS_STRIPE

• **STATUS_STRIPE**: `"#kui--status-stripe"`

Status Stripe widgets

#### Defined in

[packages/test/src/api/selectors.ts:339](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L339)

---

### STATUS_STRIPE_BLOCK

• **STATUS_STRIPE_BLOCK**: `".kui--status-stripe .kui--input-stripe .repl-block"`

#### Defined in

[packages/test/src/api/selectors.ts:58](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L58)

---

### STATUS_STRIPE_MESSAGE

• **STATUS_STRIPE_MESSAGE**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:341](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L341)

---

### STATUS_STRIPE_PROMPT

• **STATUS_STRIPE_PROMPT**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:59](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L59)

---

### Sidebar

• **Sidebar**: `default`

#### Defined in

[packages/test/src/api/selectors.ts:20](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L20)

---

### TAB_CONTENT

• **TAB_CONTENT**: `".kui--tab-content"`

#### Defined in

[packages/test/src/api/selectors.ts:29](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L29)

---

### TERMINAL_CARD

• **TERMINAL_CARD**: `".kui--card"`

Terminal card

#### Defined in

[packages/test/src/api/selectors.ts:220](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L220)

---

### TERMINAL_CARD_BODY

• **TERMINAL_CARD_BODY**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:222](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L222)

---

### TERMINAL_CARD_TITLE

• **TERMINAL_CARD_TITLE**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:221](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L221)

---

### TOP_TAB

• **TOP_TAB**: `".kui--tab-list > .kui--tab"`

#### Defined in

[packages/test/src/api/selectors.ts:24](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L24)

---

### WELCOME_BLOCK

• **WELCOME_BLOCK**: `string`

#### Defined in

[packages/test/src/api/selectors.ts:55](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L55)

---

### \_PROMPT_BLOCK

• **\_PROMPT_BLOCK**: `".repl-block"`

#### Defined in

[packages/test/src/api/selectors.ts:42](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L42)

---

### \_RESULT

• **\_RESULT**: `".repl-result"`

#### Defined in

[packages/test/src/api/selectors.ts:40](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L40)

---

### \_SIDECAR

• **\_SIDECAR**: `".kui--sidecar"`

#### Defined in

[packages/test/src/api/selectors.ts:61](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L61)

---

### \_TABLE_AS_GRID

• **\_TABLE_AS_GRID**: `".kui--data-table-as-grid"`

#### Defined in

[packages/test/src/api/selectors.ts:276](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L276)

---

### \_TABLE_EMPTY

• **\_TABLE_EMPTY**: `".kui--table-like-wrapper tbody td[data-is-empty=\"true\"]"`

#### Defined in

[packages/test/src/api/selectors.ts:288](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L288)

---

### tabButtonSelector

• **tabButtonSelector**: `"#new-tab-button"`

#### Defined in

[packages/test/src/api/selectors.ts:409](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L409)

## Functions

### ALT_BUFFER_N

▸ `Const` **ALT_BUFFER_N**(`N`): `string`

xterm

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:336](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L336)

---

### BLOCK_DOWN_BUTTON

▸ `Const` **BLOCK_DOWN_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:235](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L235)

---

### BLOCK_LINK_BUTTON

▸ `Const` **BLOCK_LINK_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:237](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L237)

---

### BLOCK_REMOVE_BUTTON

▸ `Const` **BLOCK_REMOVE_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:233](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L233)

---

### BLOCK_SECTION_BUTTON

▸ `Const` **BLOCK_SECTION_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:236](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L236)

---

### BLOCK_UP_BUTTON

▸ `Const` **BLOCK_UP_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:234](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L234)

---

### BY_KEY

▸ `Const` **BY_KEY**(`key`): `string`

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `key` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:296](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L296)

---

### BY_NAME

▸ `Const` **BY_NAME**(`name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:295](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L295)

---

### COMMAND_COPY_BUTTON

▸ `Const` **COMMAND_COPY_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:238](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L238)

---

### COMMAND_COPY_DONE_BUTTON

▸ `Const` **COMMAND_COPY_DONE_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:239](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L239)

---

### COMMAND_RERUN_BUTTON

▸ `Const` **COMMAND_RERUN_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:240](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L240)

---

### CURRENT_GRID_BY_NAME_FOR_SPLIT

▸ `Const` **CURRENT_GRID_BY_NAME_FOR_SPLIT**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:323](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L323)

---

### CURRENT_GRID_FOR_SPLIT

▸ `Const` **CURRENT_GRID_FOR_SPLIT**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:322](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L322)

---

### CURRENT_GRID_OFFLINE_FOR_SPLIT

▸ `Const` **CURRENT_GRID_OFFLINE_FOR_SPLIT**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:327](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L327)

---

### CURRENT_GRID_ONLINE_FOR_SPLIT

▸ `Const` **CURRENT_GRID_ONLINE_FOR_SPLIT**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:325](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L325)

---

### CURRENT_PROMPT_BLOCK_FOR_SPLIT

▸ `Const` **CURRENT_PROMPT_BLOCK_FOR_SPLIT**(`splitIndex`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `splitIndex` | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:182](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L182)

---

### CURRENT_PROMPT_FOR_SPLIT

▸ `Const` **CURRENT_PROMPT_FOR_SPLIT**(`splitIndex`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `splitIndex` | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:183](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L183)

---

### DLIST_DESCRIPTION_FOR

▸ `Const` **DLIST_DESCRIPTION_FOR**(`term`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `term` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:406](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L406)

---

### DROPDOWN_MENU_ITEM_NAMED

▸ `Const` **DROPDOWN_MENU_ITEM_NAMED**(`label`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `label` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:387](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L387)

---

### DROPDOWN_N

▸ `Const` **DROPDOWN_N**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:386](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L386)

---

### DROPDOWN_N_MENU_ITEM

▸ `Const` **DROPDOWN_N_MENU_ITEM**(`N`, `label`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `label`      | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:388](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L388)

---

### EXPANDABLE_OUTPUT_LAST

▸ `Const` **EXPANDABLE_OUTPUT_LAST**(`splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:399](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L399)

---

### EXPANDABLE_OUTPUT_LAST_IN_NOTEBOOK

▸ `Const` **EXPANDABLE_OUTPUT_LAST_IN_NOTEBOOK**(`splitIndex?`, `N?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `splitIndex` | `number` | `1`           |
| `N`          | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:401](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L401)

---

### EXPANDABLE_OUTPUT_N

▸ `Const` **EXPANDABLE_OUTPUT_N**(`N`, `splitIndex?`): `string`

Expandable output in notebooks

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:397](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L397)

---

### GRID_CELL_BY_NAME

▸ `Const` **GRID_CELL_BY_NAME**(`name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:297](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L297)

---

### LIST_RESULTS_BY_NAME_N

▸ `Const` **LIST_RESULTS_BY_NAME_N**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:247](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L247)

---

### LIST_RESULTS_N

▸ `Const` **LIST_RESULTS_N**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:243](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L243)

---

### LIST_RESULT_BY_N_AND_NAME

▸ `Const` **LIST_RESULT_BY_N_AND_NAME**(`N`, `name`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `name`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:299](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L299)

---

### LIST_RESULT_BY_N_FOR_NAME

▸ `Const` **LIST_RESULT_BY_N_FOR_NAME**(`N`, `name`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `name`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:253](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L253)

---

### OK_N

▸ `Const` **OK_N**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:301](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L301)

---

### OUTPUT_LAST_FOR_SPLIT

▸ `Const` **OUTPUT_LAST_FOR_SPLIT**(`splitIndex`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `splitIndex` | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:205](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L205)

---

### OUTPUT_LAST_FOR_SPLIT_IN_NOTEBOOK

▸ `Const` **OUTPUT_LAST_FOR_SPLIT_IN_NOTEBOOK**(`splitIndex`, `N?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `splitIndex` | `number` | `undefined`   |
| `N`          | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:206](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L206)

---

### OUTPUT_LAST_IN_NOTEBOOK

▸ `Const` **OUTPUT_LAST_IN_NOTEBOOK**(`N?`): `string`

#### Parameters

| Name | Type     | Default value |
| :--- | :------- | :------------ |
| `N`  | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:209](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L209)

---

### OUTPUT_LAST_PTY_IN_NOTEBOOK

▸ `Const` **OUTPUT_LAST_PTY_IN_NOTEBOOK**(`N?`): `string`

#### Parameters

| Name | Type     | Default value |
| :--- | :------- | :------------ |
| `N`  | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:214](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L214)

---

### OUTPUT_N

▸ `Const` **OUTPUT_N**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:225](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L225)

---

### OUTPUT_N_PTY

▸ `Const` **OUTPUT_N_PTY**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:228](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L228)

---

### OUTPUT_N_STREAMING

▸ `Const` **OUTPUT_N_STREAMING**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:226](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L226)

---

### POPOVER_SELECT_OPTION

▸ `Const` **POPOVER_SELECT_OPTION**(`value`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:356](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L356)

---

### PROCESSING_N

▸ `Const` **PROCESSING_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:50](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L50)

---

### PROMPT_BLOCK_FOR_SPLIT

▸ `Const` **PROMPT_BLOCK_FOR_SPLIT**(`splitIndex`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `splitIndex` | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:185](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L185)

---

### PROMPT_BLOCK_LAST_FOR_SPLIT

▸ `Const` **PROMPT_BLOCK_LAST_FOR_SPLIT**(`splitIndex?`, `N?`, `inNotebook?`): `string`

#### Parameters

| Name         | Type      | Default value |
| :----------- | :-------- | :------------ |
| `splitIndex` | `number`  | `1`           |
| `N`          | `number`  | `1`           |
| `inNotebook` | `boolean` | `false`       |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:196](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L196)

---

### PROMPT_BLOCK_LAST_FOR_SPLIT_IN_NOTEBOOK

▸ `Const` **PROMPT_BLOCK_LAST_FOR_SPLIT_IN_NOTEBOOK**(`splitIndex?`, `N?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `splitIndex` | `number` | `1`           |
| `N`          | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:194](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L194)

---

### PROMPT_BLOCK_LAST_IN_NOTEBOOK

▸ `Const` **PROMPT_BLOCK_LAST_IN_NOTEBOOK**(`N?`): `string`

#### Parameters

| Name | Type     | Default value |
| :--- | :------- | :------------ |
| `N`  | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:193](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L193)

---

### PROMPT_BLOCK_MENU

▸ `Const` **PROMPT_BLOCK_MENU**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:232](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L232)

---

### PROMPT_BLOCK_N

▸ `Const` **PROMPT_BLOCK_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:48](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L48)

---

### PROMPT_BLOCK_N_FOR_SPLIT

▸ `Const` **PROMPT_BLOCK_N_FOR_SPLIT**(`N`, `splitIndex`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `N`          | `number` |
| `splitIndex` | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:186](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L186)

---

### PROMPT_CONTEXT_N

▸ `Const` **PROMPT_CONTEXT_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:49](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L49)

---

### PROMPT_LAST_IN_NOTEBOOK

▸ `Const` **PROMPT_LAST_IN_NOTEBOOK**(`N?`): `string`

#### Parameters

| Name | Type     | Default value |
| :--- | :------- | :------------ |
| `N`  | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:204](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L204)

---

### PROMPT_N

▸ `Const` **PROMPT_N**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:224](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L224)

---

### PROMPT_N_FOR_SPLIT

▸ `Const` **PROMPT_N_FOR_SPLIT**(`N`, `splitIndex`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `N`          | `number` |
| `splitIndex` | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:188](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L188)

---

### RADIO_BUTTON_BY_NAME

▸ `Const` **RADIO_BUTTON_BY_NAME**(`name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:360](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L360)

---

### SIDECAR

▸ `Const` **SIDECAR**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:64](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L64)

---

### SIDECAR_ACTIVATION_TITLE

▸ `Const` **SIDECAR_ACTIVATION_TITLE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:67](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L67)

---

### SIDECAR_ALERT

▸ `Const` **SIDECAR_ALERT**(`N`, `type`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `type`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:103](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L103)

---

### SIDECAR_BACK_BUTTON

▸ `Const` **SIDECAR_BACK_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:138](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L138)

---

### SIDECAR_BACK_BUTTON_DISABLED

▸ `Const` **SIDECAR_BACK_BUTTON_DISABLED**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:140](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L140)

---

### SIDECAR_BADGES

▸ `Const` **SIDECAR_BADGES**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:89](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L89)

---

### SIDECAR_BASE

▸ `Const` **SIDECAR_BASE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:63](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L63)

---

### SIDECAR_BREADCRUMBS

▸ `Const` **SIDECAR_BREADCRUMBS**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:77](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L77)

---

### SIDECAR_CLOSE_BUTTON

▸ `Const` **SIDECAR_CLOSE_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:147](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L147)

---

### SIDECAR_CONTENT

▸ `Const` **SIDECAR_CONTENT**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:84](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L84)

---

### SIDECAR_CUSTOM_CONTENT

▸ `Const` **SIDECAR_CUSTOM_CONTENT**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:112](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L112)

---

### SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS

▸ `Const` **SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:114](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L114)

---

### SIDECAR_FORWARD_BUTTON

▸ `Const` **SIDECAR_FORWARD_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:142](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L142)

---

### SIDECAR_FORWARD_BUTTON_DISABLED

▸ `Const` **SIDECAR_FORWARD_BUTTON_DISABLED**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:144](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L144)

---

### SIDECAR_FULLY_CLOSED

▸ `Const` **SIDECAR_FULLY_CLOSED**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:153](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L153)

---

### SIDECAR_FULLY_CLOSE_BUTTON

▸ `Const` **SIDECAR_FULLY_CLOSE_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:151](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L151)

---

### SIDECAR_HEADER_NAVIGATION

▸ `Const` **SIDECAR_HEADER_NAVIGATION**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:75](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L75)

---

### SIDECAR_HERO_TITLE

▸ `Const` **SIDECAR_HERO_TITLE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:71](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L71)

---

### SIDECAR_KIND

▸ `Const` **SIDECAR_KIND**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:83](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L83)

---

### SIDECAR_LEFTNAV

▸ `Const` **SIDECAR_LEFTNAV**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:126](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L126)

---

### SIDECAR_LEFTNAV_NAV

▸ `Const` **SIDECAR_LEFTNAV_NAV**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:127](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L127)

---

### SIDECAR_LEFTNAV_TITLE

▸ `Const` **SIDECAR_LEFTNAV_TITLE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:73](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L73)

---

### SIDECAR_MODE_BUTTON

▸ `Const` **SIDECAR_MODE_BUTTON**(`N`, `mode`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `mode`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:120](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L120)

---

### SIDECAR_MODE_BUTTONS

▸ `Const` **SIDECAR_MODE_BUTTONS**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:118](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L118)

---

### SIDECAR_MODE_BUTTONS_V2

▸ `Const` **SIDECAR_MODE_BUTTONS_V2**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:132](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L132)

---

### SIDECAR_MODE_BUTTON_SELECTED

▸ `Const` **SIDECAR_MODE_BUTTON_SELECTED**(`N`, `mode`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `mode`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:122](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L122)

---

### SIDECAR_MODE_BUTTON_SELECTED_V2

▸ `Const` **SIDECAR_MODE_BUTTON_SELECTED_V2**(`N`, `mode`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `mode`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:135](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L135)

---

### SIDECAR_MODE_BUTTON_V2

▸ `Const` **SIDECAR_MODE_BUTTON_V2**(`N`, `mode`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `mode`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:133](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L133)

---

### SIDECAR_NAV_COMMAND_LINKS

▸ `Const` **SIDECAR_NAV_COMMAND_LINKS**(`N`, `link`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `link`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:128](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L128)

---

### SIDECAR_NAV_HREF_LINKS

▸ `Const` **SIDECAR_NAV_HREF_LINKS**(`N`, `link`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `link`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:130](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L130)

---

### SIDECAR_PACKAGE_NAME_TITLE

▸ `Const` **SIDECAR_PACKAGE_NAME_TITLE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:79](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L79)

---

### SIDECAR_PACKAGE_PARAMETERS

▸ `Const` **SIDECAR_PACKAGE_PARAMETERS**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:87](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L87)

---

### SIDECAR_POPUP_HERO_TITLE

▸ `Const` **SIDECAR_POPUP_HERO_TITLE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:82](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L82)

---

### SIDECAR_POPUP_TITLE

▸ `Const` **SIDECAR_POPUP_TITLE**(`N`, `splitIndex?`, `clickable?`): `string`

#### Parameters

| Name         | Type      | Default value |
| :----------- | :-------- | :------------ |
| `N`          | `number`  | `undefined`   |
| `splitIndex` | `number`  | `1`           |
| `clickable`  | `boolean` | `true`        |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:81](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L81)

---

### SIDECAR_RESUME_FROM_CLOSE_BUTTON

▸ `Const` **SIDECAR_RESUME_FROM_CLOSE_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:149](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L149)

---

### SIDECAR_TAB_CONTENT

▸ `Const` **SIDECAR_TAB_CONTENT**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:110](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L110)

---

### SIDECAR_TITLE

▸ `Const` **SIDECAR_TITLE**(`N`, `splitIndex?`, `clickable?`): `string`

#### Parameters

| Name         | Type      | Default value |
| :----------- | :-------- | :------------ |
| `N`          | `number`  | `undefined`   |
| `splitIndex` | `number`  | `1`           |
| `clickable`  | `boolean` | `true`        |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:69](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L69)

---

### SIDECAR_TOOLBAR

▸ `Const` **SIDECAR_TOOLBAR**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:92](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L92)

---

### SIDECAR_TOOLBAR_BUTTON

▸ `Const` **SIDECAR_TOOLBAR_BUTTON**(`N`, `mode`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `mode`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:96](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L96)

---

### SIDECAR_TOOLBAR_BUTTON_LAST

▸ `Const` **SIDECAR_TOOLBAR_BUTTON_LAST**(`mode`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `mode` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:381](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L381)

---

### SIDECAR_TOOLBAR_TEXT

▸ `Const` **SIDECAR_TOOLBAR_TEXT**(`N`, `type`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `type`       | `string` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:94](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L94)

---

### SIDECAR_TOOLBAR_TEXT_LAST

▸ `Const` **SIDECAR_TOOLBAR_TEXT_LAST**(`type`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `type` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:379](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L379)

---

### SIDECAR_WEB_ACTION_URL

▸ `Const` **SIDECAR_WEB_ACTION_URL**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:85](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L85)

---

### SIDECAR_WITH_FAILURE

▸ `Const` **SIDECAR_WITH_FAILURE**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:65](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L65)

---

### SOURCE_REF_N

▸ `Const` **SOURCE_REF_N**(`N`, `splitIndex?`): `string`

SourceRef

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:365](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L365)

---

### SOURCE_REF_TOGGLE_N

▸ `Const` **SOURCE_REF_TOGGLE_N**(`N`, `expanded?`, `splitIndex?`): `string`

#### Parameters

| Name         | Type      | Default value |
| :----------- | :-------- | :------------ |
| `N`          | `number`  | `undefined`   |
| `expanded`   | `boolean` | `false`       |
| `splitIndex` | `number`  | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:366](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L366)

---

### SPLIT_BOTTOM

▸ `Const` **SPLIT_BOTTOM**(`baseSelector?`): `string`

#### Parameters

| Name           | Type     | Default value |
| :------------- | :------- | :------------ |
| `baseSelector` | `string` | `SPLITS`      |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:176](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L176)

---

### SPLIT_DEFAULT

▸ `Const` **SPLIT_DEFAULT**(`baseSelector?`): `string`

#### Parameters

| Name           | Type     | Default value |
| :------------- | :------- | :------------ |
| `baseSelector` | `string` | `SPLITS`      |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:174](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L174)

---

### SPLIT_LEFT

▸ `Const` **SPLIT_LEFT**(`baseSelector?`): `string`

#### Parameters

| Name           | Type     | Default value |
| :------------- | :------- | :------------ |
| `baseSelector` | `string` | `SPLITS`      |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:175](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L175)

---

### SPLIT_N

▸ `Const` **SPLIT_N**(`N`, `inverseColors?`): `string`

#### Parameters

| Name            | Type      | Default value |
| :-------------- | :-------- | :------------ |
| `N`             | `number`  | `undefined`   |
| `inverseColors` | `boolean` | `false`       |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:165](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L165)

---

### SPLIT_N_AS_BOTTOM_STRIP

▸ `Const` **SPLIT_N_AS_BOTTOM_STRIP**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:180](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L180)

---

### SPLIT_N_AS_DEFAULT

▸ `Const` **SPLIT_N_AS_DEFAULT**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:178](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L178)

---

### SPLIT_N_AS_LEFT_STRIP

▸ `Const` **SPLIT_N_AS_LEFT_STRIP**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:179](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L179)

---

### SPLIT_N_CLEAR

▸ `Const` **SPLIT_N_CLEAR**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:170](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L170)

---

### SPLIT_N_CLOSE

▸ `Const` **SPLIT_N_CLOSE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:168](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L168)

---

### SPLIT_N_FOCUS

▸ `Const` **SPLIT_N_FOCUS**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:171](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L171)

---

### SPLIT_N_HEADER

▸ `Const` **SPLIT_N_HEADER**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:167](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L167)

---

### SPLIT_N_MENU

▸ `Const` **SPLIT_N_MENU**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:330](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L330)

---

### SPLIT_N_OUTPUT

▸ `Const` **SPLIT_N_OUTPUT**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:172](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L172)

---

### SPLIT_N_POSITION_TOGGLE

▸ `Const` **SPLIT_N_POSITION_TOGGLE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:169](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L169)

---

### STATUS_STRIPE_DROPDOWN_LABEL

▸ `Const` **STATUS_STRIPE_DROPDOWN_LABEL**(`which`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `which` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:346](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L346)

---

### STATUS_STRIPE_TYPE

▸ `Const` **STATUS_STRIPE_TYPE**(`type`): `string`

#### Parameters

| Name   | Type                    |
| :----- | :---------------------- |
| `type` | `"default"` \| `"blue"` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:340](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L340)

---

### STATUS_STRIPE_WIDGET

▸ `Const` **STATUS_STRIPE_WIDGET**(`which`, `dot?`): `string`

#### Parameters

| Name    | Type           | Default value |
| :------ | :------------- | :------------ |
| `which` | `string`       | `undefined`   |
| `dot`   | `"."` \| `"#"` | `'.'`         |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:342](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L342)

---

### STATUS_STRIPE_WIDGET_ICON_WITH_ATTR

▸ `Const` **STATUS_STRIPE_WIDGET_ICON_WITH_ATTR**(`which`, `key`, `value`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `which` | `string` |
| `key`   | `string` |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:348](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L348)

---

### STATUS_STRIPE_WIDGET_LABEL

▸ `Const` **STATUS_STRIPE_WIDGET_LABEL**(`which`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `which` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:345](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L345)

---

### STATUS_STRIPE_WIDGET_LABEL_WITH_ATTR

▸ `Const` **STATUS_STRIPE_WIDGET_LABEL_WITH_ATTR**(`which`, `key`, `value`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `which` | `string` |
| `key`   | `string` |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:350](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L350)

---

### STATUS_STRIPE_WIDGET_WITH_ATTR

▸ `Const` **STATUS_STRIPE_WIDGET_WITH_ATTR**(`which`, `key`, `value`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `which` | `string` |
| `key`   | `string` |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:343](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L343)

---

### TABLE_AS_GRID

▸ `Const` **TABLE_AS_GRID**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:277](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L277)

---

### TABLE_AS_GRID_CELL

▸ `Const` **TABLE_AS_GRID_CELL**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:278](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L278)

---

### TABLE_AS_GRID_CELL_GREEN

▸ `Const` **TABLE_AS_GRID_CELL_GREEN**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:281](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L281)

---

### TABLE_AS_GRID_CELL_RED

▸ `Const` **TABLE_AS_GRID_CELL_RED**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:280](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L280)

---

### TABLE_AS_LIST

▸ `Const` **TABLE_AS_LIST**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:282](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L282)

---

### TABLE_AS_SEQUENCE

▸ `Const` **TABLE_AS_SEQUENCE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:284](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L284)

---

### TABLE_AS_SEQUENCE_BAR

▸ `Const` **TABLE_AS_SEQUENCE_BAR**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:285](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L285)

---

### TABLE_AS_SEQUENCE_BAR_WIDTH

▸ `Const` **TABLE_AS_SEQUENCE_BAR_WIDTH**(`N`, `width`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `N`     | `number` |
| `width` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:286](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L286)

---

### TABLE_CELL

▸ `Const` **TABLE_CELL**(`rowKey`, `cellKey`): `string`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `rowKey`  | `string` |
| `cellKey` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:256](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L256)

---

### TABLE_FOOTER

▸ `Const` **TABLE_FOOTER**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:271](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L271)

---

### TABLE_FOOTER_MESSAGE

▸ `Const` **TABLE_FOOTER_MESSAGE**(`N`, `M`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |
| `M`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:272](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L272)

---

### TABLE_FOOTER_MESSAGE_LINK

▸ `Const` **TABLE_FOOTER_MESSAGE_LINK**(`N`, `M`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |
| `M`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:274](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L274)

---

### TABLE_HEADER_CELL

▸ `Const` **TABLE_HEADER_CELL**(`cellKey`): `string`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `cellKey` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:255](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L255)

---

### TABLE_HISTOGRAM_TEXT

▸ `Const` **TABLE_HISTOGRAM_TEXT**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:261](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L261)

---

### TABLE_HISTOGRAM_TEXT_WITH_ID

▸ `Const` **TABLE_HISTOGRAM_TEXT_WITH_ID**(`id`, `N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:262](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L262)

---

### TABLE_PAGINATION_BACKWARD

▸ `Const` **TABLE_PAGINATION_BACKWARD**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:269](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L269)

---

### TABLE_PAGINATION_FORWARD

▸ `Const` **TABLE_PAGINATION_FORWARD**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:267](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L267)

---

### TABLE_SHOW_AS_GRID

▸ `Const` **TABLE_SHOW_AS_GRID**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:257](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L257)

---

### TABLE_SHOW_AS_HISTOGRAM

▸ `Const` **TABLE_SHOW_AS_HISTOGRAM**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:260](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L260)

---

### TABLE_SHOW_AS_LIST

▸ `Const` **TABLE_SHOW_AS_LIST**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:259](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L259)

---

### TABLE_SHOW_AS_SEQUENCE

▸ `Const` **TABLE_SHOW_AS_SEQUENCE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:258](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L258)

---

### TABLE_TITLE

▸ `Const` **TABLE_TITLE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:291](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L291)

---

### TABLE_TITLE_NROWS

▸ `Const` **TABLE_TITLE_NROWS**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:294](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L294)

---

### TABLE_TITLE_SECONDARY

▸ `Const` **TABLE_TITLE_SECONDARY**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:293](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L293)

---

### TAB_N

▸ `Const` **TAB_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:34](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L34)

---

### TAB_SELECTED_N

▸ `Const` **TAB_SELECTED_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:35](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L35)

---

### TAB_TITLE_N

▸ `Const` **TAB_TITLE_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:33](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L33)

---

### TERMINAL_ALERT

▸ `Const` **TERMINAL_ALERT**(`type`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `type` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:107](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L107)

---

### TOP_TAB_CLOSE_N

▸ `Const` **TOP_TAB_CLOSE_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:27](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L27)

---

### TOP_TAB_N

▸ `Const` **TOP_TAB_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:25](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L25)

---

### TOP_TAB_N_CLICKABLE

▸ `Const` **TOP_TAB_N_CLICKABLE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:26](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L26)

---

### TOP_TAB_WITH_TITLE

▸ `Const` **TOP_TAB_WITH_TITLE**(`title`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `title` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:28](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L28)

---

### WATCHER_CLOSE_BUTTON

▸ `Const` **WATCHER_CLOSE_BUTTON**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:331](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L331)

---

### WATCHER_N

▸ `Const` **WATCHER_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:304](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L304)

---

### WATCHER_N_CLOSE

▸ `Const` **WATCHER_N_CLOSE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:319](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L319)

---

### WATCHER_N_DROPDOWN

▸ `Const` **WATCHER_N_DROPDOWN**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:316](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L316)

---

### WATCHER_N_DROPDOWN_ITEM

▸ `Const` **WATCHER_N_DROPDOWN_ITEM**(`N`, `label`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `N`     | `number` |
| `label` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:317](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L317)

---

### WATCHER_N_GRID_CELL

▸ `Const` **WATCHER_N_GRID_CELL**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:306](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L306)

---

### WATCHER_N_GRID_CELL_OFFLINE

▸ `Const` **WATCHER_N_GRID_CELL_OFFLINE**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:310](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L310)

---

### WATCHER_N_GRID_CELL_ONLINE

▸ `Const` **WATCHER_N_GRID_CELL_ONLINE**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:308](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L308)

---

### WATCHER_N_GRID_CELL_PENDING

▸ `Const` **WATCHER_N_GRID_CELL_PENDING**(`N`, `name`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `N`    | `number` |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:312](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L312)

---

### WATCHER_N_SHOW_AS_TABLE

▸ `Const` **WATCHER_N_SHOW_AS_TABLE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:320](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L320)

---

### WATCHER_N_TITLE

▸ `Const` **WATCHER_N_TITLE**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:315](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L315)

---

### WATCH_LIVE_BUTTON

▸ `Const` **WATCH_LIVE_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:263](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L263)

---

### WATCH_OFFLINE_BUTTON

▸ `Const` **WATCH_OFFLINE_BUTTON**(`N`, `splitIndex?`): `string`

#### Parameters

| Name         | Type     | Default value |
| :----------- | :------- | :------------ |
| `N`          | `number` | `undefined`   |
| `splitIndex` | `number` | `1`           |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:265](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L265)

---

### \_PROMPT_BLOCK_N

▸ `Const` **\_PROMPT_BLOCK_N**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:47](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L47)

---

### xtermRows

▸ `Const` **xtermRows**(`N`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`string`

#### Defined in

[packages/test/src/api/selectors.ts:302](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/selectors.ts#L302)
