import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    acl_cap_create_system_admin: {
                        table: 'sys_security_acl'
                        id: '1fb9371d8f9441a9994a78cdfbca42ff'
                    }
                    acl_cap_read: {
                        table: 'sys_security_acl'
                        id: 'eaf3c900849841cfa80acd77d1c42b76'
                    }
                    acl_cap_write_system_admin: {
                        table: 'sys_security_acl'
                        id: '4096df523fed45fca7c880c5d06a4db4'
                    }
                    acl_credit_create_staff: {
                        table: 'sys_security_acl'
                        id: 'e7dc3474deed4dbaa4051afdc116b05d'
                    }
                    acl_credit_read_staff: {
                        table: 'sys_security_acl'
                        id: '446a47d2ca264f91bdb025d862fd72e6'
                    }
                    acl_credit_write_staff: {
                        table: 'sys_security_acl'
                        id: 'a32fd19512234ab7a8cfc9d5808e5caf'
                    }
                    acl_entity_read_applicant: {
                        table: 'sys_security_acl'
                        id: '1faabcb7f9b54a778f11e0007dff5735'
                    }
                    acl_entity_read_staff: {
                        table: 'sys_security_acl'
                        id: '7e1bb748e0d948c5ae40aedac2ddd532'
                    }
                    acl_entity_write_address_applicant: {
                        table: 'sys_security_acl'
                        id: 'cd6b2c33f025451baf464bceb3746b0e'
                    }
                    acl_entity_write_all_fields_staff: {
                        table: 'sys_security_acl'
                        id: '43f368e8c56942eaaed78843f7190dfd'
                    }
                    acl_entity_write_applicant: {
                        table: 'sys_security_acl'
                        id: '8c71484ca2344b76baca3103d06dec63'
                    }
                    acl_entity_write_business_name_applicant: {
                        table: 'sys_security_acl'
                        id: 'ee9e49ac907643df93278723f6d67238'
                    }
                    acl_entity_write_employee_count_applicant: {
                        table: 'sys_security_acl'
                        id: 'c746446834a14a3d9ca245042be0e169'
                    }
                    acl_entity_write_industry_applicant: {
                        table: 'sys_security_acl'
                        id: '3deff13c7cbe4c71ab18d6a959e869bb'
                    }
                    acl_entity_write_staff: {
                        table: 'sys_security_acl'
                        id: '6b9d7038bae74870ba62eff4a7a960f6'
                    }
                    acl_exp_item_create_applicant: {
                        table: 'sys_security_acl'
                        id: '82a990bb2f8c4ac9ac238228535bb5b4'
                    }
                    acl_exp_item_delete_applicant: {
                        table: 'sys_security_acl'
                        id: 'f16456ba60dd46dda71d2387fed0718b'
                    }
                    acl_exp_item_read_applicant: {
                        table: 'sys_security_acl'
                        id: '46d414a9474a4348a4e0a3de0f92452c'
                    }
                    acl_exp_item_read_staff: {
                        table: 'sys_security_acl'
                        id: '1887d73c2b774c298dcf2c1700fa8c14'
                    }
                    acl_exp_item_write_applicant: {
                        table: 'sys_security_acl'
                        id: '9d0b1f9a62a9425c87226c402cb1e7d3'
                    }
                    acl_expense_create_system_admin: {
                        table: 'sys_security_acl'
                        id: '6688befb44ce4e03919fab5b9e66c9b7'
                    }
                    acl_expense_read: {
                        table: 'sys_security_acl'
                        id: 'd143cd4b2fa94bba9177e5343047389b'
                    }
                    acl_expense_write_system_admin: {
                        table: 'sys_security_acl'
                        id: '731c2fc4c66e4addb0d6d3cc387d1006'
                    }
                    acl_expert_fee_create_system_admin: {
                        table: 'sys_security_acl'
                        id: '9886ff7f56b54ddd82f962d4a7f461f6'
                    }
                    acl_expert_fee_read: {
                        table: 'sys_security_acl'
                        id: 'b006c349bbe442c4b61ac08c4e324a10'
                    }
                    acl_expert_fee_write_system_admin: {
                        table: 'sys_security_acl'
                        id: 'ee4b8facf9ae4d73907a4eb38a734784'
                    }
                    acl_industry_create_system_admin: {
                        table: 'sys_security_acl'
                        id: '67b171d2ed194359a917a6eee034b002'
                    }
                    acl_industry_read_applicant: {
                        table: 'sys_security_acl'
                        id: '759c7abaa4834692b77b4e556b45adce'
                    }
                    acl_industry_read_staff: {
                        table: 'sys_security_acl'
                        id: '1f1d21ae13df4beaa54a550c8adeb9a1'
                    }
                    acl_industry_read_system_admin: {
                        table: 'sys_security_acl'
                        id: '9a0558b01ad9499bab4cefb399332533'
                    }
                    acl_industry_write_system_admin: {
                        table: 'sys_security_acl'
                        id: '7b601a06dd2048abb237299916da0926'
                    }
                    acl_inquiry_create_applicant: {
                        table: 'sys_security_acl'
                        id: '87a20ebac4f043aebdb88649ad20f773'
                    }
                    acl_inquiry_read_applicant: {
                        table: 'sys_security_acl'
                        id: '96646844e4074f1aa10862790d3ae42b'
                    }
                    acl_inquiry_read_staff: {
                        table: 'sys_security_acl'
                        id: '828ef6027a7d44c69a8b0bea59f5a49f'
                    }
                    acl_inquiry_write_all_fields_staff_admin: {
                        table: 'sys_security_acl'
                        id: '21cb3f68b05c4bef884fc38ab7f382f6'
                    }
                    acl_inquiry_write_assigned_staff: {
                        table: 'sys_security_acl'
                        id: '9fd0a2c10ff6452c834925074b0c7567'
                    }
                    acl_inquiry_write_replied_on_staff: {
                        table: 'sys_security_acl'
                        id: '1e0bbdb0c70d40fdaec8ee6df5c3b7fd'
                    }
                    acl_inquiry_write_reply_body_staff: {
                        table: 'sys_security_acl'
                        id: 'ce036c479afd4e958fda273a7e8e0195'
                    }
                    acl_inquiry_write_staff: {
                        table: 'sys_security_acl'
                        id: '576ba778ad66423fa6232e0d7735549e'
                    }
                    acl_inquiry_write_state_staff: {
                        table: 'sys_security_acl'
                        id: 'db7ae65f286f4c7b946bfc877a017e4c'
                    }
                    acl_notice_create_staff: {
                        table: 'sys_security_acl'
                        id: 'd5cc6f0d525141c4b021030f25fe7d2f'
                    }
                    acl_notice_delete_staff_admin: {
                        table: 'sys_security_acl'
                        id: '7cc7d1c6f01e401ca17eb97036b8f8b3'
                    }
                    acl_notice_read_applicant: {
                        table: 'sys_security_acl'
                        id: '895de9c7e3744506970310aa0e6021ca'
                    }
                    acl_notice_read_staff: {
                        table: 'sys_security_acl'
                        id: '8c9236999e6d41ef8533ececc9fa3c26'
                    }
                    acl_notice_write_staff: {
                        table: 'sys_security_acl'
                        id: '96f118ede420483a95686a6f6a0b5c2c'
                    }
                    acl_rate_create_system_admin: {
                        table: 'sys_security_acl'
                        id: '25f52135f6f042c2a2ac852f11fee98d'
                    }
                    acl_rate_read: {
                        table: 'sys_security_acl'
                        id: 'b7fb5f02e76a46abb9ce633c09ad8b10'
                    }
                    acl_rate_write_system_admin: {
                        table: 'sys_security_acl'
                        id: '0341cfdf2415420faadf46da2966b07f'
                    }
                    acl_read_create_applicant: {
                        table: 'sys_security_acl'
                        id: 'ae331f22d8d5457abf8638da84570019'
                    }
                    acl_read_read_applicant: {
                        table: 'sys_security_acl'
                        id: 'b6e5540e58e34beaad2cadf17095302a'
                    }
                    acl_read_read_staff: {
                        table: 'sys_security_acl'
                        id: 'c0e33f36448344718e635185e999ad27'
                    }
                    acl_read_write_applicant: {
                        table: 'sys_security_acl'
                        id: '550917dc0a6e4bcf863df0e811a26127'
                    }
                    acl_req_doc_read_applicant: {
                        table: 'sys_security_acl'
                        id: 'c3f7690995cf41778db24a47c0ea7c16'
                    }
                    acl_req_doc_read_staff: {
                        table: 'sys_security_acl'
                        id: 'ee4891e0dbe24c5a90062ec0cfbea757'
                    }
                    acl_req_doc_write_applicant: {
                        table: 'sys_security_acl'
                        id: '94e95da27eca429fbe42a787fa1e157f'
                    }
                    acl_req_log_read_applicant: {
                        table: 'sys_security_acl'
                        id: '3e8e67c3a2c1446c89bfe1f0c050c565'
                    }
                    acl_req_log_read_staff: {
                        table: 'sys_security_acl'
                        id: '8a67d36b6b9346f187ae76c8b053934c'
                    }
                    acl_request_create_applicant: {
                        table: 'sys_security_acl'
                        id: 'e368986f983c4ed9a4de9a694260df0d'
                    }
                    acl_request_read_applicant: {
                        table: 'sys_security_acl'
                        id: 'fe82db3a92694c83a0ae8aa7bd85251f'
                    }
                    acl_request_read_staff: {
                        table: 'sys_security_acl'
                        id: 'a4010fafdf6243838ba41092da53039f'
                    }
                    acl_request_write_applicant: {
                        table: 'sys_security_acl'
                        id: 'b998ad38456144d2b468ecacf33c082a'
                    }
                    acl_request_write_staff: {
                        table: 'sys_security_acl'
                        id: 'bb80c9294748445c8d1e780d8abf4edb'
                    }
                    acl_user_read_applicant: {
                        table: 'sys_security_acl'
                        id: 'aa119d1e996744118ba24574f42e0f01'
                    }
                    acl_user_read_staff: {
                        table: 'sys_security_acl'
                        id: 'ead71ef95abc4f11a75925ad96714cfb'
                    }
                    acl_user_write_all_fields_staff: {
                        table: 'sys_security_acl'
                        id: '4ccdb7cd02f34a639c7cf2676d4c35bd'
                    }
                    acl_user_write_email_applicant: {
                        table: 'sys_security_acl'
                        id: 'af6d81f795974207aaa7edb7ade6ff60'
                    }
                    acl_user_write_self: {
                        table: 'sys_security_acl'
                        id: '00b36fb9a8e14e07a3b36b2d06a2c355'
                    }
                    acl_user_write_staff: {
                        table: 'sys_security_acl'
                        id: 'f62cd4ba4b804886bcd4a5590645eb6a'
                    }
                    annotation_application_review_amount: {
                        table: 'sys_ui_annotation'
                        id: '4e638678b59b4cf98568a85120d23484'
                    }
                    annotation_application_review_flow: {
                        table: 'sys_ui_annotation'
                        id: 'fe36860a15494614a3b1b312a45ff629'
                    }
                    annotation_credit_check_flow: {
                        table: 'sys_ui_annotation'
                        id: '483dcc4284e44e148fb4b601334e2053'
                    }
                    annotation_expense_category_master: {
                        table: 'sys_ui_annotation'
                        id: 'ec6d8b200a7f460893aa3319a148e98d'
                    }
                    annotation_expert_fee_master: {
                        table: 'sys_ui_annotation'
                        id: '5072a249ec9e473f99a61cac84e6011c'
                    }
                    annotation_industry_master: {
                        table: 'sys_ui_annotation'
                        id: '86a125ef64114f51846bc469ca95bcbb'
                    }
                    annotation_inquiry_reply_flow: {
                        table: 'sys_ui_annotation'
                        id: '4dae486bffe04d9f8d51537a35d57dc7'
                    }
                    annotation_notice_publish_flow: {
                        table: 'sys_ui_annotation'
                        id: 'bcc4cb7897614318876ed91e7b9e49ca'
                    }
                    annotation_registration_review_flow: {
                        table: 'sys_ui_annotation'
                        id: '2dead47ec4b24376852fab836bed3592'
                    }
                    annotation_subsidy_cap_master: {
                        table: 'sys_ui_annotation'
                        id: 'cdb96b6b6fab4c8ea9a035e2759023c6'
                    }
                    annotation_subsidy_rate_master: {
                        table: 'sys_ui_annotation'
                        id: 'e93e38c5aecb4188996335b34267b38c'
                    }
                    app_fix_col: {
                        table: 'sp_column'
                        id: '1abdf315d30b4aa2a3a474e90bef23b5'
                    }
                    app_fix_container: {
                        table: 'sp_container'
                        id: '1badadade1764f51bbcc05be3304b101'
                    }
                    app_fix_inst: {
                        table: 'sp_instance'
                        id: '2db74acf045c4dd194d19a1f9cae9f27'
                    }
                    app_fix_row: {
                        table: 'sp_row'
                        id: 'd9c2ecff321d441a8af7ebfb4f86d88c'
                    }
                    ApplicationAwardUtil: {
                        table: 'sys_script_include'
                        id: '9e10608a465748da8bbf83b2f6458c98'
                    }
                    ApplicationCreditUtil: {
                        table: 'sys_script_include'
                        id: 'e0992490849a4d9db57a550ff4277ada'
                    }
                    ApplicationDefectUtil: {
                        table: 'sys_script_include'
                        id: '831c23cffcde49df9407757cf6e2b815'
                    }
                    ApplicationDocumentUtil: {
                        table: 'sys_script_include'
                        id: '9518c73479b1434ba313d86c39cf5c55'
                    }
                    ApplicationExpenseUtil: {
                        table: 'sys_script_include'
                        id: 'efcdd9c8ecb54f25ad9bf6dfb4f2bd68'
                    }
                    ApplicationLogUtil: {
                        table: 'sys_script_include'
                        id: '63c10315553740eb989ae7ca811190e6'
                    }
                    ApplicationReviewUtil: {
                        table: 'sys_script_include'
                        id: 'cada502e98d247bf8fb23a12c1214277'
                    }
                    ApplicationStatusUtil: {
                        table: 'sys_script_include'
                        id: '6603faf16296458c9f7a70fd4c449fdc'
                    }
                    ApplicationSubmitUtil: {
                        table: 'sys_script_include'
                        id: 'c65d7096a0e64661b92057739baca16e'
                    }
                    apply_col: {
                        table: 'sp_column'
                        id: '8a1cc3b151634efd8b125fe0ed6e799c'
                    }
                    apply_conf_col: {
                        table: 'sp_column'
                        id: 'de465a78ee6945ec97242fa355f00083'
                    }
                    apply_conf_container: {
                        table: 'sp_container'
                        id: 'ca638242d75c47b6ac7558be86b21207'
                    }
                    apply_conf_inst: {
                        table: 'sp_instance'
                        id: '4489b3f30a4844b1b36bd8442657bafb'
                    }
                    apply_conf_row: {
                        table: 'sp_row'
                        id: '9e8531f2bd4347a393ec44fef3e8051b'
                    }
                    apply_container: {
                        table: 'sp_container'
                        id: '6dc75666897443f3b7978419392cfe90'
                    }
                    apply_doc_col: {
                        table: 'sp_column'
                        id: 'add9659a80b64aec8c29cb5b65a0868e'
                    }
                    apply_doc_container: {
                        table: 'sp_container'
                        id: '5a0651f7a210442799b1c722e33423ed'
                    }
                    apply_doc_inst: {
                        table: 'sp_instance'
                        id: '020ad3e2b9bb4045933a24c0a6a822cc'
                    }
                    apply_doc_row: {
                        table: 'sp_row'
                        id: '2078f46ac3d94fb188db17487caa6f76'
                    }
                    apply_exp_col: {
                        table: 'sp_column'
                        id: '2d7204fcc6cd48f0aa375b79a26cb1d8'
                    }
                    apply_exp_container: {
                        table: 'sp_container'
                        id: '3537417083d74c91964a11a91f996f06'
                    }
                    apply_exp_inst: {
                        table: 'sp_instance'
                        id: '4dbb5f0f83294ae7add17e912e1a64f9'
                    }
                    apply_exp_row: {
                        table: 'sp_row'
                        id: '5b827fb1bc774f0eaebc4329118ea63d'
                    }
                    apply_inst: {
                        table: 'sp_instance'
                        id: 'b75e0682176c45ad86b5cb21809018e8'
                    }
                    apply_row: {
                        table: 'sp_row'
                        id: '73ba1dcfc3b4453396a8dcb8540a080d'
                    }
                    apps_col: {
                        table: 'sp_column'
                        id: '948e4c03721b4164a17e95284ef5f423'
                    }
                    apps_container: {
                        table: 'sp_container'
                        id: 'f5bb4ef6b5a045deb0ef8bff8ee8291a'
                    }
                    apps_inst: {
                        table: 'sp_instance'
                        id: '98891a3053b847c8b0ffbf41e4752439'
                    }
                    apps_row: {
                        table: 'sp_row'
                        id: '0e40388085b249e99d1f0c3c990ceec6'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'd90f8d11e94f423cb9e4c25d81daa4fc'
                    }
                    br_inquiry_before_save: {
                        table: 'sys_script'
                        id: 'ad97589922ca40f7a651be4e873d718c'
                    }
                    br_notice_before_save: {
                        table: 'sys_script'
                        id: '5f91a1735d4747068f420e88315e437b'
                    }
                    defect_fix_col: {
                        table: 'sp_column'
                        id: 'd4fd1cc03f924ab48101a6f419cb9fe7'
                    }
                    defect_fix_container: {
                        table: 'sp_container'
                        id: 'cf3dd7ecaf8f42759c5f27817291bd8d'
                    }
                    defect_fix_inst: {
                        table: 'sp_instance'
                        id: '4284b61c8a0748ecaed68ff094e71e3e'
                    }
                    defect_fix_row: {
                        table: 'sp_row'
                        id: '79a131fbd9a649b389c1e52f047ab65f'
                    }
                    demo_entity_branch: {
                        table: 'x_dent2_dentsusoke_entity'
                        id: '8eaef6a1e1654be2ba1dc9ea87cc6c2a'
                    }
                    demo_entity_sample: {
                        table: 'x_dent2_dentsusoke_entity'
                        id: 'c7c1dcd3102e4b5ba5469784930ecc5e'
                    }
                    demo_entity_test: {
                        table: 'x_dent2_dentsusoke_entity'
                        id: '763124dd0cb44b01af63d583b8ea7973'
                    }
                    demo_entity_yamada: {
                        table: 'x_dent2_dentsusoke_entity'
                        id: '3a760cf6c9d74bfc9e34b43d6cfeddc5'
                    }
                    demo_inquiry_expense: {
                        table: 'x_dent2_dentsusoke_inquiry'
                        id: '3f7e95e22615487397f9d5c43fc226d4'
                    }
                    demo_notice_document_format: {
                        table: 'x_dent2_dentsusoke_notice'
                        id: 'aeef836b839d4b48ac15b8653ce43733'
                    }
                    demo_notice_first_review: {
                        table: 'x_dent2_dentsusoke_notice'
                        id: '8e66cd7913874d3ab34068ee6eead595'
                    }
                    demo_notice_maintenance: {
                        table: 'x_dent2_dentsusoke_notice'
                        id: '5ff94df843af4334a70f5685d2f3c749'
                    }
                    demo_request_2026_00123: {
                        table: 'x_dent2_dentsusoke_request'
                        id: '38bb9628d60b4c8799c30ce301954002'
                        deleted: true
                    }
                    demo_user_applicant: {
                        table: 'x_dent2_dentsusoke_user'
                        id: '9753f14ea4764cb5a9ec2bfc60353b48'
                    }
                    demo_user_defect1: {
                        table: 'x_dent2_dentsusoke_user'
                        id: '872254637d994d388588090d6605dd36'
                    }
                    demo_user_review1: {
                        table: 'x_dent2_dentsusoke_user'
                        id: '4c77c2503e094266abafaa3541fbcac1'
                    }
                    demo_user_review2: {
                        table: 'x_dent2_dentsusoke_user'
                        id: '88739d3ba494441fb55846dcb5250fbc'
                    }
                    demo_user_review3: {
                        table: 'x_dent2_dentsusoke_user'
                        id: '37d9fbb610ae4d2bb99e407c65e95397'
                    }
                    demo_user_role_applicant: {
                        table: 'sys_user_has_role'
                        id: '894e00b5455d4b16bfbc286bbaeb70fd'
                    }
                    demo_user_role_staff: {
                        table: 'sys_user_has_role'
                        id: '1a53b46a39c24e0a91b193ff8bb96ca5'
                    }
                    demo_user_staff: {
                        table: 'sys_user'
                        id: '9504f9dc5f434caa938d298f29fb3462'
                    }
                    fix_align_subsidy_rate_master: {
                        table: 'sys_script_fix'
                        id: 'd983032f1f2b44fa88d37e9e2e9c970e'
                    }
                    fix_invalidate_plaintext_passwords: {
                        table: 'sys_script_fix'
                        id: '8dc6d5f68f52451290368b82b396d193'
                    }
                    fix_remove_demo_request: {
                        table: 'sys_script_fix'
                        id: '06bf6f1364d54bf0b08e3a7b22fdb7ee'
                    }
                    form_action_item_award_approve: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '798d7e8823ed485f95c09bdf8563d42b'
                    }
                    form_action_item_award_reject: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '4d832913ddef46ac9760dd3e4efb4fe3'
                    }
                    form_action_item_award_return: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'd599b9f0c5ac42b3a00c63f419d3c00f'
                    }
                    form_action_item_credit_cancel: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '6a9abec336f0477688da95bef8cfb527'
                    }
                    form_action_item_credit_judge_exempt: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '7e80ea2eea564f7ea72572848f6cd050'
                    }
                    form_action_item_credit_judge_required: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '0caa06edaf4b4230b14d501d07a85eaf'
                    }
                    form_action_item_credit_receive: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'e1d6d7f277c9442497720ecc16fa932e'
                    }
                    form_action_item_credit_remind: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'abe49b35c366411585033fdaa5d652a7'
                    }
                    form_action_item_credit_request: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '39a1b9d51c83407d8795dde223b0ad0e'
                    }
                    form_action_item_inquiry_assign_to_me: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '3f790a24f48841899f1d4a09d373922c'
                    }
                    form_action_item_inquiry_reopen: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'bdec4348c5fc4b39b847424e98aba8c0'
                    }
                    form_action_item_inquiry_reply: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '752b6a398ccb4b75b507d6d64a9783be'
                    }
                    form_action_item_notice_publish: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'e839c37ab8f3489f909d67fa9d20b439'
                    }
                    form_action_item_notice_unpublish: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '4744ba32868045f58b31cf5c4da00175'
                    }
                    form_action_item_registration_approve: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '127e88acb5294ac6a46f052ac9965459'
                    }
                    form_action_item_registration_reject: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'f2a1928a7b2d4c2091a7e530f3e7536f'
                    }
                    form_action_item_registration_request_defect: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'af39d810579146c4996d8314bd3fb074'
                    }
                    form_action_item_review_assign_to_me: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'a10d3305361e48c5b146d3cf2d7f13a0'
                    }
                    form_action_item_review_complete: {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'cfe599e3170341b0a2ef690e60db1dc7'
                    }
                    form_action_item_review_reject: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '4c034b248fde4c93b2ebfac6ceea6a5f'
                    }
                    form_action_item_review_request_defect: {
                        table: 'sys_ux_form_action_layout_item'
                        id: '937e5d91cec3451f80b5a1ac689db5cf'
                    }
                    inquiries_col: {
                        table: 'sp_column'
                        id: '88a500b989454fbea07df9bea0ec75f2'
                    }
                    inquiries_container: {
                        table: 'sp_container'
                        id: 'b75e168e96144b2e8ef29b444ac5bed6'
                    }
                    inquiries_inst: {
                        table: 'sp_instance'
                        id: '74d687830388476ab406c3a7c2be4cf9'
                    }
                    inquiries_row: {
                        table: 'sp_row'
                        id: '7375fb0593fc4f149c6e9a91245f47f2'
                    }
                    InquiryAdminUtil: {
                        table: 'sys_script_include'
                        id: '724b98e2eb4942929daacb4fab31e323'
                    }
                    login_col: {
                        table: 'sp_column'
                        id: 'bd0232d80b834d30bfece45c101e3504'
                    }
                    login_container: {
                        table: 'sp_container'
                        id: '29625a5ddc7e4fd7903963d6cf2ca4ab'
                    }
                    login_inst_form: {
                        table: 'sp_instance'
                        id: '39ff489e3fde4c658b0ca32b50c6b216'
                    }
                    login_inst_links: {
                        table: 'sp_instance'
                        id: 'cf9106e3022d4ed587c21a259f001a43'
                    }
                    login_row: {
                        table: 'sp_row'
                        id: '240a5f2580464af9b2380a4388f95cdf'
                    }
                    master_cap_gt100: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '0605c499caf24d37af88b2e1313cb325'
                    }
                    master_cap_gt100_special: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '8664e63aa12c4a88b90b9e08ee0f2c56'
                    }
                    master_cap_le100: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '44c80956c14a43e99663514ca0c0aa07'
                    }
                    master_cap_le100_special: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: 'b80ed996c1964224a251ad79ab10f5ba'
                    }
                    master_cap_le20: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '2fc2f5b30fb24dc69e104905f7d1d842'
                    }
                    master_cap_le20_special: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '552da96301db415393a12f4df70da2b1'
                    }
                    master_cap_le5: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: 'b03156a2bb9146ef9d9db17e083534dd'
                    }
                    master_cap_le5_special: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '9e5a9ec89c414f7c967979b9087a170a'
                    }
                    master_cap_le50: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '4ce76f75d8b648c1b79583f5fd5455fe'
                    }
                    master_cap_le50_special: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '6695126696664df78c75a8ff4f649a14'
                    }
                    master_cap_sole_proprietor: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: 'b2c144f4b0dc4925b6e3ea2a3766264b'
                    }
                    master_cap_sole_proprietor_special: {
                        table: 'x_dent2_dentsusoke_cap'
                        id: '2b160c4718d6445b9b948c109a00d9ec'
                    }
                    master_expense_advertising: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: 'fb6c421e90684d62bd77edcccd5945c4'
                    }
                    master_expense_cloud: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: 'd28c29f7795a41fa876029b2fc274b17'
                    }
                    master_expense_expert: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: 'c1ea0a236a154fad8b5a16ef3fb29eae'
                    }
                    master_expense_ip: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: '3b95b491236542f1900faae9bff317e9'
                    }
                    master_expense_machinery: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: '1bcbd95b963c431ba11f04b4f6effcf5'
                    }
                    master_expense_material: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: 'eb0f40fed8324733981c094ea11a8c59'
                    }
                    master_expense_outsourcing: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: 'ae9bbbef621644e38ccead3e2efb9e53'
                    }
                    master_expense_system: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: '07a2d2a0c4184b0b8fb9e3c485e0dde1'
                    }
                    master_expense_training: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: '01c5a1912c154fe9a9aba7a40e6e2a8c'
                    }
                    master_expense_travel: {
                        table: 'x_dent2_dentsusoke_expense'
                        id: 'a63f13fc784048c7981ebce2702f5776'
                    }
                    master_expert_fee_class1: {
                        table: 'x_dent2_dentsusoke_expert_fee'
                        id: '8de5c9b7cca04d33ab8ba6b8e2a5a1a1'
                    }
                    master_expert_fee_class2: {
                        table: 'x_dent2_dentsusoke_expert_fee'
                        id: '54ae6266f34f4fbca2836af9c886f40d'
                    }
                    master_expert_fee_class3: {
                        table: 'x_dent2_dentsusoke_expert_fee'
                        id: '0c7770136e1b4cfb87121afd579eee1d'
                    }
                    master_industry_construction: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: '1c4450f770fc4b0b9b02e2f079619e80'
                    }
                    master_industry_manufacturing: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: '99c4e364f4cd45fc86d8cfe4524244e3'
                    }
                    master_industry_other: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: '4d07c6439f4e475ab46e24040925b3be'
                    }
                    master_industry_retail: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: 'f3533e039aca471a812490857776ca12'
                    }
                    master_industry_service: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: '53af2752d35e4fd4b43308ae5ad2f419'
                    }
                    master_industry_transportation: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: 'd8bcbdfe53e9444097cb4bc57bd54e6b'
                    }
                    master_industry_wholesale: {
                        table: 'x_dent2_dentsusoke_industry'
                        id: 'b17ffd52ced546f29102dbab43a30ae1'
                    }
                    master_rate_gt100: {
                        table: 'x_dent2_dentsusoke_rate'
                        id: '682c8702ee1743d3a7c10ae84643129a'
                        deleted: false
                    }
                    master_rate_le100: {
                        table: 'x_dent2_dentsusoke_rate'
                        id: 'b4c71e13d00344f9bff429436ce678b1'
                        deleted: false
                    }
                    master_rate_le20: {
                        table: 'x_dent2_dentsusoke_rate'
                        id: '5b6e95e5ff8047d7b672d599a127ed33'
                        deleted: false
                    }
                    master_rate_le5: {
                        table: 'x_dent2_dentsusoke_rate'
                        id: 'c322e4c0b2364a0484beafbbf2a3fd51'
                        deleted: false
                    }
                    master_rate_le50: {
                        table: 'x_dent2_dentsusoke_rate'
                        id: '86ea33a5f5944ddebe3373b492e32890'
                        deleted: false
                    }
                    master_rate_sole_proprietor: {
                        table: 'x_dent2_dentsusoke_rate'
                        id: '60b985279b9d4afd9789e82cf8a011d7'
                        deleted: false
                    }
                    menu_item_apply: {
                        table: 'sp_rectangle_menu_item'
                        id: '75e7fb98f4e044ff99a711f3462cba3c'
                    }
                    menu_item_apps: {
                        table: 'sp_rectangle_menu_item'
                        id: '36c14126744e4ab8908546cf0e94d5ef'
                    }
                    menu_item_inquiries: {
                        table: 'sp_rectangle_menu_item'
                        id: 'f2159acb83434e7fa3cf97ab6bb85eba'
                    }
                    menu_item_mypage: {
                        table: 'sp_rectangle_menu_item'
                        id: 'ae7976cf4b474edc9af6eebb5e98447c'
                    }
                    menu_item_notices: {
                        table: 'sp_rectangle_menu_item'
                        id: '6cb612202abc402ab4151eb61233e528'
                    }
                    menu_item_profile: {
                        table: 'sp_rectangle_menu_item'
                        id: '071da3bce8a044819010b46bf8dadffb'
                    }
                    mypage_col_apps: {
                        table: 'sp_column'
                        id: 'b2220543ec74477db16a33d551251908'
                    }
                    mypage_col_notices: {
                        table: 'sp_column'
                        id: '100563e623cb407ba4886786cdec0baa'
                    }
                    mypage_col_summary: {
                        table: 'sp_column'
                        id: 'f41ec774bd8f47aea01b4a0d51d32c0c'
                    }
                    mypage_container_main: {
                        table: 'sp_container'
                        id: '1fc3297220e04171ad8f7397625a900e'
                    }
                    mypage_inst_apps: {
                        table: 'sp_instance'
                        id: '893f457f50114ce58f85af5d72558e91'
                    }
                    mypage_inst_notices: {
                        table: 'sp_instance'
                        id: 'dcc007e624b1496e8b02e3ed6e1e5396'
                    }
                    mypage_inst_summary: {
                        table: 'sp_instance'
                        id: '7bcf4c3cef494163b6ca1a944eb375ea'
                    }
                    mypage_row_lists: {
                        table: 'sp_row'
                        id: '5c3a5b96d9ae4e0ea65d57347505bcd6'
                    }
                    mypage_row_summary: {
                        table: 'sp_row'
                        id: 'c25a6a3be999468a8a8540198fca2152'
                    }
                    notice_detail_col: {
                        table: 'sp_column'
                        id: '2b351db83bea40fbabf3fc0ee5b23889'
                    }
                    notice_detail_container: {
                        table: 'sp_container'
                        id: 'bbb1c53166154dc5870b1f6ec97170ef'
                    }
                    notice_detail_inst: {
                        table: 'sp_instance'
                        id: '660020eb924647419bc94f641db7ebbf'
                    }
                    notice_detail_row: {
                        table: 'sp_row'
                        id: 'aaa186fe58674a5c896af652047141c4'
                    }
                    NoticeAdminUtil: {
                        table: 'sys_script_include'
                        id: 'c681df2dd7584ea8a4db575e19dba9f3'
                    }
                    notices_col: {
                        table: 'sp_column'
                        id: 'ba3f354569014ca5a1ed92dbf2313003'
                    }
                    notices_container: {
                        table: 'sp_container'
                        id: '5fff076c9c5d46c091152c80d74d6e1a'
                    }
                    notices_inst: {
                        table: 'sp_instance'
                        id: 'de5d50b6ed04440299d21d03e9df9c07'
                    }
                    notices_row: {
                        table: 'sp_row'
                        id: '0b24e58fbc5746d1a978e0d903314e67'
                    }
                    NoticeUtil: {
                        table: 'sys_script_include'
                        id: '2f6ff5355eb340299ac185aaf9b78cc5'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '20aeba4f06ca44ec84f7e28eb9d2c325'
                    }
                    PortalContextUtil: {
                        table: 'sys_script_include'
                        id: '4a6f9a0c65ec4bfe88e36be3b26ba3c9'
                    }
                    profile_col: {
                        table: 'sp_column'
                        id: '8295425504574168ad8c0b7fd57ee8d1'
                    }
                    profile_container: {
                        table: 'sp_container'
                        id: 'bb8f337a40f64c109989e1cb0cc6c370'
                    }
                    profile_inst: {
                        table: 'sp_instance'
                        id: 'be3d4d7889c54d569fcf4391434c6a07'
                    }
                    profile_row: {
                        table: 'sp_row'
                        id: '497ba7063264405982e4f4450f00be8b'
                    }
                    prop_credit_due_days: {
                        table: 'sys_properties'
                        id: 'e79319183485447c9b10172045ada96f'
                    }
                    prop_credit_threshold_amount: {
                        table: 'sys_properties'
                        id: '4703d4ea0381473c966bf821616599f4'
                    }
                    prop_defect_token_valid_days: {
                        table: 'sys_properties'
                        id: '16e1544542d64285b4a14c91bb9e5cf6'
                    }
                    prop_document_allowed_extensions: {
                        table: 'sys_properties'
                        id: '79a77381e8aa4abea1664d45d6c38d6b'
                    }
                    prop_document_max_file_size_mb: {
                        table: 'sys_properties'
                        id: 'f1481f3ff88941e2adefe31192ca8cb4'
                    }
                    prop_notice_max_visible_for_count: {
                        table: 'sys_properties'
                        id: '8555a8a6a2a64dc2870670ed4abf2f72'
                    }
                    prop_page_app_defect_fix: {
                        table: 'sys_properties'
                        id: '99342e87b8f048bfaeefe9f882bce0d5'
                    }
                    prop_page_defect_fix: {
                        table: 'sys_properties'
                        id: 'dacaf2f40f3144a88b1d677468d8a25f'
                    }
                    prop_page_reset: {
                        table: 'sys_properties'
                        id: '20ac0920fad44f3f8e05a67e8ceb9c1a'
                    }
                    prop_page_signup: {
                        table: 'sys_properties'
                        id: '2af92be63bc9478bae30cb1e2308aa05'
                    }
                    prop_portal_url_suffix: {
                        table: 'sys_properties'
                        id: 'f8ff22965cdc4ceba39e7870b47bdba8'
                    }
                    prop_review_defect_due_days: {
                        table: 'sys_properties'
                        id: '027f69b7aad647d5a76143fbe570c910'
                    }
                    prop_review_sla_days: {
                        table: 'sys_properties'
                        id: '2841a3873373479889da6b4b7a1040bc'
                    }
                    prop_signup_duplicate_scan_limit: {
                        table: 'sys_properties'
                        id: 'f57d94c4a55840ce80b94df8f0d1341c'
                    }
                    provisioning_col_nav: {
                        table: 'sp_column'
                        id: '9dbe781a74ce46969aabf430da000751'
                        deleted: true
                    }
                    provisioning_col_review: {
                        table: 'sp_column'
                        id: 'fbd1b00252df44c490682ee723b620fb'
                        deleted: true
                    }
                    provisioning_container_main: {
                        table: 'sp_container'
                        id: '4aa58e5b10b241e681a1829f910a46a5'
                        deleted: true
                    }
                    provisioning_inst_nav: {
                        table: 'sp_instance'
                        id: 'a2f0720a057243639ef33002c4c12076'
                        deleted: true
                    }
                    provisioning_inst_review: {
                        table: 'sp_instance'
                        id: '6224a89815884dc8b13e72da57e89338'
                        deleted: true
                    }
                    provisioning_row_main: {
                        table: 'sp_row'
                        id: '32e483bf326b4dbe9339580d98f699d2'
                        deleted: true
                    }
                    register_col: {
                        table: 'sp_column'
                        id: '2d4978e14af1440fa330b0cd2adca501'
                    }
                    register_container: {
                        table: 'sp_container'
                        id: '7fb5591bd8c34d80a6040101cbc5edd2'
                    }
                    register_inst: {
                        table: 'sp_instance'
                        id: '57a6c11689b34500ae6f6c29462c7d61'
                    }
                    register_row: {
                        table: 'sp_row'
                        id: '9a667a0fe121457ea514ac285d6dd96d'
                    }
                    RegistrationDefectUtil: {
                        table: 'sys_script_include'
                        id: '848ed82d22534018a5462748548f0222'
                    }
                    RegistrationDuplicateUtil: {
                        table: 'sys_script_include'
                        id: 'c853056e43724ac1b4adbf9ee1164b7f'
                    }
                    RegistrationReviewUtil: {
                        table: 'sys_script_include'
                        id: '711e9b5215964c47851a5c4175fa466c'
                    }
                    report_entities: {
                        table: 'sys_report'
                        id: 'e3a466d6149a4a7aabb76a90f8fa825f'
                    }
                    report_entities_by_industry: {
                        table: 'sys_report'
                        id: 'e03d2d1016f04280b664e5db4a164719'
                    }
                    report_inquiries: {
                        table: 'sys_report'
                        id: 'f2d8e9a6205149c2a39a391fc0eb2126'
                    }
                    report_notices: {
                        table: 'sys_report'
                        id: 'c7a2718fd91a4ebd853f19c31d100de3'
                    }
                    report_requests_accepted: {
                        table: 'sys_report'
                        id: '598c2f337fe84a969f29d0f643eea0dc'
                    }
                    report_requests_awarded: {
                        table: 'sys_report'
                        id: '35be1c494417493ea7ac72efc0ef73f8'
                    }
                    report_requests_by_employee: {
                        table: 'sys_report'
                        id: 'fc7505d6b74946a69a566d4d3c945261'
                    }
                    report_requests_by_status: {
                        table: 'sys_report'
                        id: 'f8c9d267f0c545b38396bd03d01949bb'
                    }
                    report_requests_rejected: {
                        table: 'sys_report'
                        id: '10feb867d731472190bcb69b174d4e98'
                    }
                    report_users_review: {
                        table: 'sys_report'
                        id: 'fa321bdbf5e14454850cf57693d01ead'
                    }
                    reset_col: {
                        table: 'sp_column'
                        id: 'ee59866c78b0474eae2850121e900561'
                    }
                    reset_container: {
                        table: 'sp_container'
                        id: '1ca7e5076c374286abb78733b9b06ccb'
                    }
                    reset_inst: {
                        table: 'sp_instance'
                        id: '340c937f95ea4de68ca92357356c78b0'
                    }
                    reset_row: {
                        table: 'sp_row'
                        id: 'c06c5deef13143ab90a165b46a7b07ff'
                    }
                    signup_col: {
                        table: 'sp_column'
                        id: 'fc06888f8dfe4cf48cc54260ad31398b'
                    }
                    signup_container: {
                        table: 'sp_container'
                        id: 'fa17b3907f8c4509a59b8cc37eddd78a'
                    }
                    signup_inst: {
                        table: 'sp_instance'
                        id: '443fe6e1e389475d8f015bb695c1f79d'
                    }
                    signup_row: {
                        table: 'sp_row'
                        id: '65c6f2028bd54dfe978a27947623dd7a'
                    }
                    sks_category_inquiry_admin: {
                        table: 'sys_ux_list_category'
                        id: 'dbceae3e0fff4061bf7737ceab4e5db0'
                    }
                    sks_category_master_admin: {
                        table: 'sys_ux_list_category'
                        id: '404d622e291f4c5faca86d285949ba69'
                    }
                    sks_category_notice_admin: {
                        table: 'sys_ux_list_category'
                        id: '8c00f0de46e84e3c8e30159997448698'
                    }
                    sks_category_reports: {
                        table: 'sys_ux_list_category'
                        id: 'bb5a87abd55f42e099d69bd4fb84b0fc'
                    }
                    sks_category_review: {
                        table: 'sys_ux_list_category'
                        id: 'b35883da25ce4c69bfddb09cb13ebd4c'
                    }
                    sks_category_staff_admin: {
                        table: 'sys_ux_list_category'
                        id: 'f20c0968058c478888db0c3b70430458'
                    }
                    sks_category_user_admin: {
                        table: 'sys_ux_list_category'
                        id: 'dc86d6c8e2d340ce940424e0d87d3d96'
                    }
                    sks_dashboard_tab_communication: {
                        table: 'par_dashboard_tab'
                        id: '3f521256a7b2457ebd944ce27c683666'
                    }
                    sks_dashboard_tab_requests: {
                        table: 'par_dashboard_tab'
                        id: '6d714721e556478690181b62cd38cd4f'
                    }
                    sks_dashboard_tab_review: {
                        table: 'par_dashboard_tab'
                        id: '5729c87736dc48b788178de77bb48251'
                    }
                    sks_list_award_pending: {
                        table: 'sys_ux_list'
                        id: 'fe922518ec904dd9ae7cfa19a44c0351'
                    }
                    sks_list_award_pending_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'c5ecfa7866d84e1ab11192a39a0b8920'
                    }
                    sks_list_caps: {
                        table: 'sys_ux_list'
                        id: '7609cc3c3ef44e089ca737193f403f66'
                    }
                    sks_list_caps_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '014e30399c084cccbecef212bb136e42'
                    }
                    sks_list_caps_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '9d02aca76aea425b80992dcf3261d20e'
                    }
                    sks_list_credit_all: {
                        table: 'sys_ux_list'
                        id: 'f362b996959a4240a18f64ef24b42fe8'
                    }
                    sks_list_credit_all_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'b93dcd0380d74860aeb8542cfadf1ec8'
                    }
                    sks_list_credit_judging: {
                        table: 'sys_ux_list'
                        id: '0b4ad25446ce4022be1ebf6ac214c26f'
                    }
                    sks_list_credit_judging_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '3260a584093e4a4ca014e31153bbd290'
                    }
                    sks_list_credit_open: {
                        table: 'sys_ux_list'
                        id: '10a15051d9aa4b18ba28e8dd649d15bc'
                    }
                    sks_list_credit_open_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'c7ec086f7c0648768563b800938427c1'
                    }
                    sks_list_credit_overdue: {
                        table: 'sys_ux_list'
                        id: '34c673873f714e0abc997836d64479c6'
                    }
                    sks_list_credit_overdue_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '9c56f68e832d480a8a538431ccac56b8'
                    }
                    sks_list_entities: {
                        table: 'sys_ux_list'
                        id: '919952b7275f4786bdb77569f6f2e517'
                    }
                    sks_list_entities_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '1ba3ddf642d446e29afc54107636a1f3'
                    }
                    sks_list_expenses: {
                        table: 'sys_ux_list'
                        id: '0ccfb364129b403c9603f363c9421da6'
                    }
                    sks_list_expenses_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '16d22a631e7c4d16acc9c7f19d0381c6'
                    }
                    sks_list_expenses_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'e587365e7a2a48848249c452431fb3d9'
                    }
                    sks_list_expert_fees: {
                        table: 'sys_ux_list'
                        id: 'e327cd20b6404770a2e3f1ee4db2bea0'
                    }
                    sks_list_expert_fees_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '7d3e209d47ab4ae7b0eae104950ea888'
                    }
                    sks_list_expert_fees_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '25ec5bfce1854ddf9effd7d573c85c15'
                    }
                    sks_list_industries_active: {
                        table: 'sys_ux_list'
                        id: '060ecf44bb4a4465af606029882aec17'
                    }
                    sks_list_industries_active_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'babffe9053044e59bd12fd53ffd61322'
                    }
                    sks_list_industries_active_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'fe583e1cb45c451ba25ee7d1b340c8d3'
                    }
                    sks_list_industries_all: {
                        table: 'sys_ux_list'
                        id: '00802420b180401b96b864d5db2bb475'
                    }
                    sks_list_industries_all_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '9a42a520a985407db627184993dac2f5'
                    }
                    sks_list_industries_all_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '8b0962b58c994b9a84ab40b2b711c996'
                    }
                    sks_list_inquiries_all: {
                        table: 'sys_ux_list'
                        id: '9670e3035d2f4de5b87ad948f7200f1f'
                    }
                    sks_list_inquiries_all_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'eac8fc5c4f1145a086e20accaf9fe468'
                    }
                    sks_list_inquiries_answered: {
                        table: 'sys_ux_list'
                        id: '2bfb42ec31d542bd8ef374f8a7d93315'
                    }
                    sks_list_inquiries_answered_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '30a7dbb7a90849e0adc4068fae236d47'
                    }
                    sks_list_inquiries_mine: {
                        table: 'sys_ux_list'
                        id: '5e7babc1029b4b1ca8fe129e8e3c45a1'
                    }
                    sks_list_inquiries_mine_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '9387a030fa6c4987ae139f218cc5e6fb'
                    }
                    sks_list_inquiries_open: {
                        table: 'sys_ux_list'
                        id: 'd087f0c4f08445a0b0ad030ca4cbc1d9'
                    }
                    sks_list_inquiries_open_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'fe702b4e7bfd478f93a2defa8a5f61c1'
                    }
                    sks_list_notices_all: {
                        table: 'sys_ux_list'
                        id: '48856cb248614b0a800e141782063684'
                    }
                    sks_list_notices_all_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '5c594444632c44fdab9213970dc0a2f3'
                    }
                    sks_list_notices_private: {
                        table: 'sys_ux_list'
                        id: 'c91f6ec7025741d693422df877fd49ec'
                    }
                    sks_list_notices_private_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '14b33a2f19344c5295b1370f6cd4ae9e'
                    }
                    sks_list_notices_published: {
                        table: 'sys_ux_list'
                        id: 'a043d5ee224543c689153f7fb2fff3dc'
                    }
                    sks_list_notices_published_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'ac42253f84674af0b9bb4b41c5f18350'
                    }
                    sks_list_rates: {
                        table: 'sys_ux_list'
                        id: '2a439a1ddcd24a788f85c7bbb7489bd0'
                    }
                    sks_list_rates_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '34f88fe51d6f4435a20de9e11d82270d'
                    }
                    sks_list_rates_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '5b6f7ff4f6bb40c9a640372c9182180b'
                    }
                    sks_list_report_awarded: {
                        table: 'sys_ux_list'
                        id: '3c49814cda97401680be58601fe98b3a'
                    }
                    sks_list_report_awarded_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '0396ee1bb97c44298e839e4619ae2bd2'
                    }
                    sks_list_report_entities: {
                        table: 'sys_ux_list'
                        id: 'b58331eb13db46bca60df947d108e87a'
                    }
                    sks_list_report_entities_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'b9411e9ebcc84b048e2c6dc6939a6e32'
                    }
                    sks_list_report_rejected: {
                        table: 'sys_ux_list'
                        id: 'eaea01b6d5e74a9ab39daada95265b16'
                    }
                    sks_list_report_rejected_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'ecd4a343cc014a10be163023e3eec477'
                    }
                    sks_list_report_requests: {
                        table: 'sys_ux_list'
                        id: 'dc4a1477d34446e6ae66a972c90d9c6a'
                    }
                    sks_list_report_requests_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '278f7bcb920343e39a574e74158589c8'
                    }
                    sks_list_review_all: {
                        table: 'sys_ux_list'
                        id: '64ba2f7a006d4b2282332739d646bee7'
                    }
                    sks_list_review_all_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '1ba7f221133641b58ebe51cdb6a9cdae'
                    }
                    sks_list_review_duplicate: {
                        table: 'sys_ux_list'
                        id: 'bcc811c36f0248e8a77e0c4670364f0a'
                    }
                    sks_list_review_duplicate_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'f0aba9e85c39423db173dc3535454d67'
                    }
                    sks_list_review_mine: {
                        table: 'sys_ux_list'
                        id: 'cb8f21a8b37547c3baa8c53146f42aa0'
                    }
                    sks_list_review_mine_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'd0ed32c969004e5dac8dab14edc55873'
                    }
                    sks_list_review_overdue: {
                        table: 'sys_ux_list'
                        id: '824975864f2e4b0d9bf66f4dabbebcd4'
                    }
                    sks_list_review_overdue_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '2de49236119a405d8a738fe6088de79a'
                    }
                    sks_list_review_pending: {
                        table: 'sys_ux_list'
                        id: '0d4f726f22ba4ae7b783b0676f8655fd'
                    }
                    sks_list_review_pending_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '69178a2edaf94001b742ba957e3e2da8'
                    }
                    sks_list_review_targets: {
                        table: 'sys_ux_list'
                        id: 'f0560e0d67c14343a90ba251e717b06e'
                    }
                    sks_list_review_targets_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '3f35feab5d0c4de9b9daf6b09f2c7c42'
                    }
                    sks_list_review_unassigned: {
                        table: 'sys_ux_list'
                        id: '6410d41689a14eb48a23f618cb741f67'
                    }
                    sks_list_review_unassigned_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '909e94c7640c4a38916c467d8792f4c8'
                    }
                    sks_list_review_waiting: {
                        table: 'sys_ux_list'
                        id: 'dbf04b9e98fd4ddf8ffeb7c65c3dda8d'
                    }
                    sks_list_review_waiting_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '9fdc96ff464945968bedab92a26a2369'
                    }
                    sks_list_role_assignments: {
                        table: 'sys_ux_list'
                        id: 'b7218580970b443a9b23ae8b3ddf0986'
                    }
                    sks_list_role_assignments_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '8db63e307317444d84ffc6f6312d742c'
                    }
                    sks_list_role_assignments_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'bd7f47428bb0474793c284f84f155839'
                    }
                    sks_list_roles: {
                        table: 'sys_ux_list'
                        id: '7d820adfc89e43658ac719e3565b18a7'
                    }
                    sks_list_roles_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'b5c57de85c3a4ed68c1f8f10bb50baf0'
                    }
                    sks_list_roles_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'a61f608e76ae4203af7f0c3886682ede'
                    }
                    sks_list_user_accounts: {
                        table: 'sys_ux_list'
                        id: '1d1700537ce64300abb6bc24786bff4b'
                    }
                    sks_list_user_accounts_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'faf99bcaea0a4d62a7e190cb5a3724c6'
                    }
                    sks_list_user_accounts_app_staff: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '5b82215ce96b43fa8e3c452a9a5ad265'
                    }
                    sks_list_users_all: {
                        table: 'sys_ux_list'
                        id: 'fab84ab8532c449ea85e75ee77cb203d'
                    }
                    sks_list_users_all_app: {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '95a29258a96d45ac9e1e29515738116f'
                    }
                    sks_staff_admin_applicability: {
                        table: 'sys_ux_applicability'
                        id: 'd179f94b8ad344758a32e6a96b23cf3e'
                    }
                    sks_staff_applicability: {
                        table: 'sys_ux_applicability'
                        id: '4304d53e20884192b1f924fd350d4af9'
                    }
                    sks_staff_dashboard: {
                        table: 'par_dashboard'
                        id: '0ac41e438c0240e5889534fd7571fb44'
                    }
                    sks_staff_list_config: {
                        table: 'sys_ux_list_menu_config'
                        id: '7591294327dd448d967d190be4bef5b4'
                    }
                    sks_staff_workspace: {
                        table: 'sys_ux_page_registry'
                        id: '9bb6e0517b5842ab9591753b7a87b810'
                    }
                    sks_staff_workspace_acl: {
                        table: 'sys_security_acl'
                        id: 'fbb95cefbb2d4535a507901cd36ba2f4'
                    }
                    sks_staff_workspace_sys_ux_app_config_workspace: {
                        table: 'sys_ux_app_config'
                        id: 'eaabc84ef8c5451e97a8f829f02164a2'
                    }
                    sks_staff_workspace_sys_ux_app_route_home: {
                        table: 'sys_ux_app_route'
                        id: '4ef64c8893844b4bbc4e70aa9fb5de6d'
                    }
                    sks_staff_workspace_sys_ux_app_route_list: {
                        table: 'sys_ux_app_route'
                        id: '19973fae23414669b17bea9cb3ace781'
                    }
                    sks_staff_workspace_sys_ux_app_route_record: {
                        table: 'sys_ux_app_route'
                        id: '990b15d2219941ebb14208bd4e9bdfb9'
                    }
                    'sks_staff_workspace_sys_ux_app_route_simple-list': {
                        table: 'sys_ux_app_route'
                        id: 'cb66477f8d0e4c949ddf07465d246def'
                    }
                    sks_staff_workspace_sys_ux_macroponent_record: {
                        table: 'sys_ux_macroponent'
                        id: '6fc885b650c04f5da61a9aaf3b604e18'
                    }
                    sks_staff_workspace_sys_ux_page_property_chrome_footer: {
                        table: 'sys_ux_page_property'
                        id: '22e907dc53a845bd95217c163478e3a6'
                    }
                    sks_staff_workspace_sys_ux_page_property_chrome_header: {
                        table: 'sys_ux_page_property'
                        id: '19a22a6e162e4fd0afe13b563408435a'
                    }
                    sks_staff_workspace_sys_ux_page_property_chrome_tab: {
                        table: 'sys_ux_page_property'
                        id: 'ef012b360d4e46d4a3591d6d3bb1f495'
                    }
                    sks_staff_workspace_sys_ux_page_property_chrome_toolbar: {
                        table: 'sys_ux_page_property'
                        id: '3047843c420148ea8e1309d0e21d4c7c'
                    }
                    sks_staff_workspace_sys_ux_page_property_listConfigId: {
                        table: 'sys_ux_page_property'
                        id: 'a6ecbb7362e44a078efc4a384c21d60d'
                    }
                    sks_staff_workspace_sys_ux_page_property_view: {
                        table: 'sys_ux_page_property'
                        id: 'f91178c0160b46e98cb3ff828b638c11'
                    }
                    sks_staff_workspace_sys_ux_page_property_wbApplicabilityConfigId: {
                        table: 'sys_ux_page_property'
                        id: '75507472327e4be292f56afdd6fc8479'
                    }
                    sks_staff_workspace_sys_ux_registry_m2m_category_unifiedNav: {
                        table: 'sys_ux_registry_m2m_category'
                        id: 'd3d0a8b3027c4f6594bea6d6ba1a5bcc'
                    }
                    sks_staff_workspace_sys_ux_screen_home: {
                        table: 'sys_ux_screen'
                        id: '3b08f64c32214520818072aaade8e81f'
                    }
                    sks_staff_workspace_sys_ux_screen_list: {
                        table: 'sys_ux_screen'
                        id: '8065db2880304a6dbe1cd6e27ca2d9ba'
                    }
                    sks_staff_workspace_sys_ux_screen_record: {
                        table: 'sys_ux_screen'
                        id: 'b900b435142a424787c226c001cbcaa5'
                    }
                    'sks_staff_workspace_sys_ux_screen_simple-list': {
                        table: 'sys_ux_screen'
                        id: 'a05f041459954c26a7bbd7bd5f2272d2'
                    }
                    sks_staff_workspace_sys_ux_screen_type_home: {
                        table: 'sys_ux_screen_type'
                        id: '0ad55d0611d7438e99468b8dfd271ffa'
                    }
                    sks_staff_workspace_sys_ux_screen_type_list: {
                        table: 'sys_ux_screen_type'
                        id: 'e57b21e215f7409899db4d5fdbd35b41'
                    }
                    sks_staff_workspace_sys_ux_screen_type_record: {
                        table: 'sys_ux_screen_type'
                        id: '47d8b01010fc4fa782852da6f6803a6b'
                    }
                    'sks_staff_workspace_sys_ux_screen_type_simple-list': {
                        table: 'sys_ux_screen_type'
                        id: '215c8cd2d7f942c4bd7e08b94698f5ed'
                    }
                    sks_system_admin_applicability: {
                        table: 'sys_ux_applicability'
                        id: '8bb73f3248eb42f2877fde04473c45e2'
                    }
                    sks_widget_defect_count: {
                        table: 'par_dashboard_widget'
                        id: 'c110ce08b3494436894801e8b5749eb2'
                    }
                    sks_widget_duplicate_breakdown: {
                        table: 'par_dashboard_widget'
                        id: '368309bb309c4d079451fed9414a6c77'
                    }
                    sks_widget_inquiry_assignee_breakdown: {
                        table: 'par_dashboard_widget'
                        id: 'ecdd758b69cb473cb109514d1538465e'
                    }
                    sks_widget_inquiry_open_count: {
                        table: 'par_dashboard_widget'
                        id: 'd8d47f7452a744d0b5280353c45f80e2'
                    }
                    sks_widget_inquiry_unassigned_count: {
                        table: 'par_dashboard_widget'
                        id: '4e7383e59cc84ff186e53f2178c89a13'
                    }
                    sks_widget_notice_private_count: {
                        table: 'par_dashboard_widget'
                        id: 'eac38f578d2348849d45f8ade1fe65c0'
                    }
                    sks_widget_notice_published_count: {
                        table: 'par_dashboard_widget'
                        id: '143b791c7d634d5aaa257a1db40b6f99'
                    }
                    sks_widget_notice_scope_breakdown: {
                        table: 'par_dashboard_widget'
                        id: '889edd1bf7064cfc8e2723cd135b89a8'
                    }
                    sks_widget_registered_count: {
                        table: 'par_dashboard_widget'
                        id: '9171da5a00d146acbe64e6f4d0ecee5e'
                    }
                    sks_widget_request_defect_count: {
                        table: 'par_dashboard_widget'
                        id: '46c67f9a637a47b5ae14fe159a120e9c'
                    }
                    sks_widget_request_done_count: {
                        table: 'par_dashboard_widget'
                        id: '5033b87ba3c842d2a75325d02b773f5d'
                    }
                    sks_widget_request_employee_breakdown: {
                        table: 'par_dashboard_widget'
                        id: 'ed9198fff2624a7a923c8ef670271f46'
                    }
                    sks_widget_request_reviewing_count: {
                        table: 'par_dashboard_widget'
                        id: '568cc12f61384341bfdad3b05bcf39ec'
                    }
                    sks_widget_request_status_breakdown: {
                        table: 'par_dashboard_widget'
                        id: '85e09fa243fb4862be436891ddfb4e90'
                    }
                    sks_widget_request_submitted_count: {
                        table: 'par_dashboard_widget'
                        id: 'f75812a9ec404d6fa6bdc61c12c67685'
                    }
                    sks_widget_review_duplicate_count: {
                        table: 'par_dashboard_widget'
                        id: 'b0e2507aed0c4c17910fe1ef56468f79'
                    }
                    sks_widget_status_breakdown: {
                        table: 'par_dashboard_widget'
                        id: 'dbfcebcf8aca4a24b459948a3a429252'
                    }
                    sks_widget_waiting_count: {
                        table: 'par_dashboard_widget'
                        id: 'e275718d0d7d4b2cbbf107e7412fd6fa'
                    }
                    'src_server_business-rules_inquiry-before-save_js': {
                        table: 'sys_module'
                        id: 'a2f845c597824729ab5c433604bafc45'
                    }
                    'src_server_business-rules_notice-before-save_js': {
                        table: 'sys_module'
                        id: 'a04194a16ee54ebc95c305d1456f2bcb'
                    }
                    'src_server_fix-scripts_align-subsidy-rate-master_js': {
                        table: 'sys_module'
                        id: 'fa79eae8bd7d43248f8dcbbfebd161e6'
                    }
                    'src_server_fix-scripts_invalidate-plaintext-passwords_js': {
                        table: 'sys_module'
                        id: '2dda960ba36340ab9c5468fef97d4264'
                    }
                    'src_server_fix-scripts_remove-demo-request_js': {
                        table: 'sys_module'
                        id: 'aed9375dae7f4d55bad37f73ffbb19da'
                    }
                    'src_server_mail-scripts_app-defect-fix-link_js': {
                        table: 'sys_module'
                        id: '6efaf6a3d67d47e99eee86f015a9ed5b'
                    }
                    'src_server_mail-scripts_defect-fix-link_js': {
                        table: 'sys_module'
                        id: '7d9424d43ab84c03afadb134314316df'
                    }
                    'src_server_mail-scripts_password-reset-link_js': {
                        table: 'sys_module'
                        id: '42e7937ca98e4dbcaa0e89af0041b529'
                    }
                    'src_server_mail-scripts_registration-link_js': {
                        table: 'sys_module'
                        id: 'c3bc54a754b14530b2e8c1384eb37707'
                    }
                    'src_server_script-includes_application-award-util_js': {
                        table: 'sys_module'
                        id: 'd610d8ac9dff438e898a00be7dd30005'
                    }
                    'src_server_script-includes_application-credit-util_js': {
                        table: 'sys_module'
                        id: '375bcf36e8214ab8a314266f3a9f8bda'
                    }
                    'src_server_script-includes_application-defect-util_js': {
                        table: 'sys_module'
                        id: '8a2d830a979b413081a200a0bece5fb9'
                    }
                    'src_server_script-includes_application-document-util_js': {
                        table: 'sys_module'
                        id: '04741d62f68d498ea0ce9d3396f234f1'
                    }
                    'src_server_script-includes_application-expense-util_js': {
                        table: 'sys_module'
                        id: 'e7cfe56eaacc45829615ace0d0942082'
                    }
                    'src_server_script-includes_application-log-util_js': {
                        table: 'sys_module'
                        id: '81cf7acb57f34ab987a9cd7e4e8a1137'
                    }
                    'src_server_script-includes_application-review-util_js': {
                        table: 'sys_module'
                        id: '5791432cd6c445f4b0ba122c077c4258'
                    }
                    'src_server_script-includes_application-status-util_js': {
                        table: 'sys_module'
                        id: '8be9fcf1b32443798302a4730f13114b'
                    }
                    'src_server_script-includes_application-submit-util_js': {
                        table: 'sys_module'
                        id: '1bd261e2b81740439e4e5861f1f52bc3'
                    }
                    'src_server_script-includes_inquiry-admin-util_js': {
                        table: 'sys_module'
                        id: '56079210c16548b0b4bc2016b4cfd842'
                    }
                    'src_server_script-includes_notice-admin-util_js': {
                        table: 'sys_module'
                        id: 'e9d58f584aea4ecf9019bd7b37d0e36c'
                    }
                    'src_server_script-includes_notice-util_js': {
                        table: 'sys_module'
                        id: '7e70abca347841068687c06e853959da'
                    }
                    'src_server_script-includes_portal-context-util_js': {
                        table: 'sys_module'
                        id: '6fe4ae341f6c4ea3a2d4770367071025'
                    }
                    'src_server_script-includes_registration-defect-util_js': {
                        table: 'sys_module'
                        id: 'fb891630387f4ae7abd736da747f15df'
                    }
                    'src_server_script-includes_registration-duplicate-util_js': {
                        table: 'sys_module'
                        id: '6723d11b42fd4a3095e3703fa7fd3ad5'
                    }
                    'src_server_script-includes_registration-review-util_js': {
                        table: 'sys_module'
                        id: 'dce9f9aaccdd4f868c28f581ab550952'
                    }
                    'src_server_ui-actions_award-approve_js': {
                        table: 'sys_module'
                        id: '6ea18682a4c0468e82ea206a61994e14'
                    }
                    'src_server_ui-actions_award-reject_js': {
                        table: 'sys_module'
                        id: '0638d3866fc44ac7880a5c0752115bbd'
                    }
                    'src_server_ui-actions_award-return_js': {
                        table: 'sys_module'
                        id: 'baa93170607c4bbe8308d522fbc26a3d'
                    }
                    'src_server_ui-actions_credit-cancel_js': {
                        table: 'sys_module'
                        id: '5bf96c2887a643d09404dc66dea02672'
                    }
                    'src_server_ui-actions_credit-judge-exempt_js': {
                        table: 'sys_module'
                        id: '41e213c580074d999e2cd600db6fd09f'
                    }
                    'src_server_ui-actions_credit-judge-required_js': {
                        table: 'sys_module'
                        id: 'd9cd3aa9e939456f97891300312b84c0'
                    }
                    'src_server_ui-actions_credit-receive_js': {
                        table: 'sys_module'
                        id: '50851bf5f9f34c5d91b68edc326afa84'
                    }
                    'src_server_ui-actions_credit-remind_js': {
                        table: 'sys_module'
                        id: '0f3d89ea650d43b1b07f7009317ea053'
                    }
                    'src_server_ui-actions_credit-request_js': {
                        table: 'sys_module'
                        id: '6c9f57be0df04d769545b79caad56405'
                    }
                    'src_server_ui-actions_inquiry-assign-to-me_js': {
                        table: 'sys_module'
                        id: '7b2af07b46384c4882f9296155a30885'
                    }
                    'src_server_ui-actions_inquiry-reopen_js': {
                        table: 'sys_module'
                        id: '262b5fa7bce740f1b9cfd5be55db4de7'
                    }
                    'src_server_ui-actions_inquiry-reply_js': {
                        table: 'sys_module'
                        id: 'cfdb5323ce674eba96e9fa98414e46b8'
                    }
                    'src_server_ui-actions_notice-publish_js': {
                        table: 'sys_module'
                        id: 'f16f39f518ef4d5fa33956ce7f2e4c91'
                    }
                    'src_server_ui-actions_notice-unpublish_js': {
                        table: 'sys_module'
                        id: 'ad92b06998584e67a730d8d5e8bb9135'
                    }
                    'src_server_ui-actions_registration-approve_js': {
                        table: 'sys_module'
                        id: '8d51087a947440b1bf6023a3c17147f7'
                    }
                    'src_server_ui-actions_registration-reject_js': {
                        table: 'sys_module'
                        id: 'a85c8613c25d464babb3f9d1f665cd84'
                    }
                    'src_server_ui-actions_registration-request-defect_js': {
                        table: 'sys_module'
                        id: '8a1a503e7ccb43c3b43d5590c76074de'
                    }
                    'src_server_ui-actions_review-assign-to-me_js': {
                        table: 'sys_module'
                        id: 'db00ab4a1a64464aa0589ccb3b2de6d3'
                    }
                    'src_server_ui-actions_review-complete_js': {
                        table: 'sys_module'
                        id: '358a82b7dafb4d9e90a0dfe5d5d244f3'
                    }
                    'src_server_ui-actions_review-reject_js': {
                        table: 'sys_module'
                        id: '50eea085799546a4886960d3663c1cb1'
                    }
                    'src_server_ui-actions_review-request-defect_js': {
                        table: 'sys_module'
                        id: '4feb50bbf1894ceda88a475d66ea4744'
                    }
                    style_application_status_accepted: {
                        table: 'sys_ui_style'
                        id: '627b4ca439904612a69859b6bcddb6c9'
                    }
                    style_application_status_credit_exempt: {
                        table: 'sys_ui_style'
                        id: '05be95cb42d948b68b119b8fd251a537'
                    }
                    style_application_status_credit_judging: {
                        table: 'sys_ui_style'
                        id: 'b13b7d62c68f4d169ffed5c0348a43c2'
                    }
                    style_application_status_defect_answered: {
                        table: 'sys_ui_style'
                        id: '68858dd5de684366a04d880ec052ccab'
                    }
                    style_application_status_defect_fixing: {
                        table: 'sys_ui_style'
                        id: '85ce01fa36ff460ba97ea900ea7c63f7'
                    }
                    style_application_status_defect_request: {
                        table: 'sys_ui_style'
                        id: 'c41a331d803b433c8bc79ab19817bf8f'
                    }
                    style_application_status_ext_preparing: {
                        table: 'sys_ui_style'
                        id: 'da10760db6e14447b8e04e66d54f5db7'
                    }
                    style_application_status_ext_reviewing: {
                        table: 'sys_ui_style'
                        id: 'e6609d2586514026a8ef327b02c5a94c'
                    }
                    style_application_status_first_review: {
                        table: 'sys_ui_style'
                        id: 'ddf24b91d90c47d6a700516b0782fcb7'
                    }
                    style_application_status_first_review_done: {
                        table: 'sys_ui_style'
                        id: '2fa89419caa34f16ae638bdb3eed6bb7'
                    }
                    style_application_status_re_review: {
                        table: 'sys_ui_style'
                        id: 'ef397e8c3b5348dca21e36adb4508cba'
                    }
                    style_application_status_rejected: {
                        table: 'sys_ui_style'
                        id: 'ea142a096d844eedb42c2cfdd24ae9d1'
                    }
                    style_application_status_result_checking: {
                        table: 'sys_ui_style'
                        id: 'ea024bb8582d4d8eab1ec833890afc2c'
                    }
                    style_application_status_result_waiting: {
                        table: 'sys_ui_style'
                        id: 'fae3cbec6bc44a118eef9caaf8eec3b8'
                    }
                    style_application_status_review_done: {
                        table: 'sys_ui_style'
                        id: '270cbc7aa0ac4ab6a0960317469d4805'
                    }
                    style_application_status_withdrawn: {
                        table: 'sys_ui_style'
                        id: '4e00d8e50a344ad686d8848f54915e26'
                    }
                    style_credit_result_conditional: {
                        table: 'sys_ui_style'
                        id: 'd3390d3ba3524bb7b85e908d9977ca7e'
                    }
                    style_credit_result_ng: {
                        table: 'sys_ui_style'
                        id: 'e2b5a0dfee0b4643a23ac70ad54ba02b'
                    }
                    style_credit_result_ok: {
                        table: 'sys_ui_style'
                        id: 'eb3c9680b98845478fda658cae67daf5'
                    }
                    style_credit_state_received: {
                        table: 'sys_ui_style'
                        id: '1cf3d8fa9e984707ac97ad6d72e8f808'
                    }
                    style_credit_state_requested: {
                        table: 'sys_ui_style'
                        id: '715d018da8484b3ab8f23ce0683cf3fa'
                    }
                    style_duplicate_confirmed: {
                        table: 'sys_ui_style'
                        id: '3a83ebc1dfca4996b068873bf6a85001'
                    }
                    style_duplicate_no_duplicate: {
                        table: 'sys_ui_style'
                        id: 'cc8aaf4bf251449fbb5af13b92a4ff25'
                    }
                    style_duplicate_review: {
                        table: 'sys_ui_style'
                        id: '75d93fb173424ace9002ef0ef2c2506e'
                    }
                    style_registration_status_defect_fixing: {
                        table: 'sys_ui_style'
                        id: '277df0209f504208948017a210ab6d90'
                    }
                    style_registration_status_defect_request: {
                        table: 'sys_ui_style'
                        id: 'ea3f16da834a474a808647a292d85248'
                    }
                    style_registration_status_registered: {
                        table: 'sys_ui_style'
                        id: '79e9fbf7293a4d0380c1d8912591238d'
                    }
                    style_registration_status_rejected: {
                        table: 'sys_ui_style'
                        id: 'acf977232d1342b2939f55dc4f9e7abc'
                    }
                    style_registration_status_review: {
                        table: 'sys_ui_style'
                        id: '6d833add2d0e46cc8afd52e938722e97'
                    }
                    test_app_defect_start: {
                        table: 'sys_atf_test'
                        id: '0307c7e5150d4ed3bf61dcefa36de335'
                    }
                    test_app_defect_step_start: {
                        table: 'sys_atf_step'
                        id: 'b0995324f3a24479acff4831b869379f'
                    }
                    test_app_defect_step_submit: {
                        table: 'sys_atf_step'
                        id: 'a1c041af46e6490580c6fa076b4f233f'
                    }
                    test_app_defect_submit: {
                        table: 'sys_atf_test'
                        id: '870af93a491d4d7da34e3bd52004a7f2'
                    }
                    test_apply_judge_amount: {
                        table: 'sys_atf_test'
                        id: 'e8f140e261d74ed5a06cdcabf832817f'
                    }
                    test_apply_step_judge_amount: {
                        table: 'sys_atf_step'
                        id: '78f17fcceabc40bba114af1b20ec0e6a'
                    }
                    test_apply_step_submit: {
                        table: 'sys_atf_step'
                        id: '5d0f6d8f09ee4ad4917d26c3ea17886e'
                    }
                    test_apply_submit: {
                        table: 'sys_atf_test'
                        id: 'd0c65c5207644cf19cbcc6fc1271e5f1'
                    }
                    test_award_calc: {
                        table: 'sys_atf_test'
                        id: '8a67bdb5559a4973bd60bfadc0d07763'
                    }
                    test_award_decide: {
                        table: 'sys_atf_test'
                        id: 'f1b5742985eb42b5b76c44540cb6dccf'
                    }
                    test_award_step_calc: {
                        table: 'sys_atf_step'
                        id: '9af9abfe59284966acab733ee817b62f'
                    }
                    test_award_step_decide: {
                        table: 'sys_atf_step'
                        id: 'bb9d37da4d9a4156b8950ca376cd6ca0'
                    }
                    test_confirm_ready: {
                        table: 'sys_atf_test'
                        id: '2450ad52e8fe4c03b2f61262ba7e0dd9'
                    }
                    test_confirm_step_ready: {
                        table: 'sys_atf_step'
                        id: '3ace2ab433fa4561bfdcbdf9ec406a3b'
                    }
                    test_credit_flow: {
                        table: 'sys_atf_test'
                        id: '8f19d4bcf45548a4b95c931248cb8394'
                    }
                    test_credit_judge: {
                        table: 'sys_atf_test'
                        id: '68d358269d6c48c9ab8824fdcb971fc2'
                    }
                    test_credit_step_flow: {
                        table: 'sys_atf_step'
                        id: '0014f5c3485f4020994c15aa1d44852c'
                    }
                    test_credit_step_judge: {
                        table: 'sys_atf_step'
                        id: 'ae335397fb1540b7ac958c128a54168f'
                    }
                    test_diag_password_methods: {
                        table: 'sys_atf_test'
                        id: 'a62d7a426e034a1fb5a792ed87dfc4cc'
                        deleted: true
                    }
                    test_diag_password_step: {
                        table: 'sys_atf_step'
                        id: 'd3e3ab4ff03442a88ec01a1991ee124d'
                        deleted: true
                    }
                    test_doc_step_upload: {
                        table: 'sys_atf_step'
                        id: 'e67bb497042b456aa20f8cc24c672fc1'
                    }
                    test_doc_step_validate: {
                        table: 'sys_atf_step'
                        id: 'd2c22318dbc14f73a7f78dd79d792ce5'
                    }
                    test_doc_upload: {
                        table: 'sys_atf_test'
                        id: '083522864ae24f51a6ef14df4a57b5af'
                    }
                    test_doc_validate: {
                        table: 'sys_atf_test'
                        id: '85bc4ca2fb2a4abbbd7d774aa9c433e9'
                    }
                    test_exp_save: {
                        table: 'sys_atf_test'
                        id: 'a7828de54e8e4a2fa105b96bbae70d9a'
                    }
                    test_exp_step_save: {
                        table: 'sys_atf_step'
                        id: 'bd11a71c166b4645bd312b494d53de27'
                    }
                    test_exp_step_validate: {
                        table: 'sys_atf_step'
                        id: '2aa2a114e27b47a29251bedf507a3034'
                    }
                    test_exp_validate: {
                        table: 'sys_atf_test'
                        id: '5b26d80e26c04b1c896c23e88e3d44f6'
                    }
                    test_review_assign: {
                        table: 'sys_atf_test'
                        id: 'd92c2362077745f380245dfd3251bc8d'
                    }
                    test_review_judge: {
                        table: 'sys_atf_test'
                        id: '6a9a967aa8454f748f468fcf51a2cd2c'
                    }
                    test_review_step_assign: {
                        table: 'sys_atf_step'
                        id: '01de1fca560541748f357179c17bd032'
                    }
                    test_review_step_judge: {
                        table: 'sys_atf_step'
                        id: '33c713686aeb4f1084b670e990970a83'
                    }
                    test_sc03_no_plaintext_password: {
                        table: 'sys_atf_test'
                        id: 'fdc58656858148b3855c8f3cc069ab57'
                    }
                    test_sc03_no_plaintext_step: {
                        table: 'sys_atf_step'
                        id: '91a7b689ecc44b16a22862edd8d12d78'
                    }
                    test_sc03_password_storage: {
                        table: 'sys_atf_test'
                        id: 'bdef955c97b1409d9a517ddedd6401ca'
                    }
                    test_sc03_password_storage_step: {
                        table: 'sys_atf_step'
                        id: '9162d4ad35b940f2a04e688a6064671d'
                    }
                    test_sc11_approve: {
                        table: 'sys_atf_test'
                        id: 'd9d7b8df537242f9a1bbd1b360156bcd'
                    }
                    test_sc11_guards: {
                        table: 'sys_atf_test'
                        id: '0c30c5e669ac4a42a120ac6696a0972b'
                    }
                    test_sc11_registration_review: {
                        table: 'sys_atf_test'
                        id: 'f658f003cfd344ebb00a7d4958d42b5c'
                        deleted: true
                    }
                    test_sc11_reject: {
                        table: 'sys_atf_test'
                        id: '0ae428c145c2442d80d0aa0f53bbdf7a'
                    }
                    test_sc11_request_defect: {
                        table: 'sys_atf_test'
                        id: 'fa5dfcfbcb7843e3905ba5a781c54f48'
                    }
                    test_sc11_step_approve: {
                        table: 'sys_atf_step'
                        id: '39a8791f9c0d4c68811e3a35ed0e0548'
                    }
                    test_sc11_step_guards: {
                        table: 'sys_atf_step'
                        id: 'eb8860d62f6746668ac30d01dae0f943'
                    }
                    test_sc11_step_reject: {
                        table: 'sys_atf_step'
                        id: '06c68f9cad6d4358981bbb7c80caceb4'
                    }
                    test_sc11_step_request_defect: {
                        table: 'sys_atf_step'
                        id: '81366ae4646a4aceb43cc43045f96e89'
                    }
                    test_sc11_step_util: {
                        table: 'sys_atf_step'
                        id: 'b1bb365075cc4073a96b41c3993ae896'
                        deleted: true
                    }
                    test_sc11d_request_and_open: {
                        table: 'sys_atf_test'
                        id: '1b397d26a0bd40e495680aadd2c4a2ad'
                    }
                    test_sc11d_step_request_and_open: {
                        table: 'sys_atf_step'
                        id: 'cec016c6fab64bdab4ab8f2d5bc2c85b'
                    }
                    test_sc11d_step_submit_fix: {
                        table: 'sys_atf_step'
                        id: '5b446558b2094756bb9666a5292e05f5'
                    }
                    test_sc11d_submit_fix: {
                        table: 'sys_atf_test'
                        id: '0b84ec76e5b74cc58ccb1b7e93606158'
                    }
                    test_sc12_step_lists: {
                        table: 'sys_atf_step'
                        id: '0ce38091504a47e3b6886ab7376424b5'
                    }
                    test_sc12_workspace_lists: {
                        table: 'sys_atf_test'
                        id: '3bb52bbc307642778da73223bdad0b23'
                    }
                    test_sc13_br_insert_invalid: {
                        table: 'sys_atf_test'
                        id: '6093cfbe66224326943181af3999d451'
                    }
                    test_sc13_br_insert_invalid_step: {
                        table: 'sys_atf_step'
                        id: 'f09c19c4230e444da6ac926d7036a20c'
                    }
                    test_sc13_br_insert_valid: {
                        table: 'sys_atf_test'
                        id: '0a0a78a5cb064074b51024b0e6effb72'
                    }
                    test_sc13_br_insert_valid_step: {
                        table: 'sys_atf_step'
                        id: '3afc11d62da2461f927dbe2351c8fa1f'
                    }
                    test_sc13_br_insert_valid_validate: {
                        table: 'sys_atf_step'
                        id: '4225340978364f9da32126893d274b77'
                    }
                    test_sc13_br_update_invalid: {
                        table: 'sys_atf_test'
                        id: '8980a1d793184919954aaace3e904ef4'
                    }
                    test_sc13_br_update_invalid_step: {
                        table: 'sys_atf_step'
                        id: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                    }
                    test_sc13_br_update_invalid_validate: {
                        table: 'sys_atf_step'
                        id: '97f75e9464f74979b8e61e63c3347c33'
                    }
                    test_sc13_br_update_seed: {
                        table: 'sys_atf_step'
                        id: '3956b78f24e040eaabce6e58f2ae4930'
                    }
                    test_sc13_notice_util: {
                        table: 'sys_atf_test'
                        id: '203938e5b5254d4fb1d9b8296dbb8fd9'
                        deleted: true
                    }
                    test_sc13_publish: {
                        table: 'sys_atf_test'
                        id: '162f8427406843a8893b412e5e9947f7'
                    }
                    test_sc13_step_publish: {
                        table: 'sys_atf_step'
                        id: 'aa2565fdcaa44b1d8bad614efc4f95a5'
                    }
                    test_sc13_step_util: {
                        table: 'sys_atf_step'
                        id: '6a4cd1cc1fdc435a9e75583729df47aa'
                        deleted: true
                    }
                    test_sc13_step_validate: {
                        table: 'sys_atf_step'
                        id: '3ad79e075f20447c81d848de27c495de'
                    }
                    test_sc13_validate: {
                        table: 'sys_atf_test'
                        id: 'd959c40686194111b6f92a080a03fe8a'
                    }
                    test_sc14_assign_reopen: {
                        table: 'sys_atf_test'
                        id: 'fed3aafb234249489123f9b50cc998aa'
                    }
                    test_sc14_br_insert_entity: {
                        table: 'sys_atf_step'
                        id: 'dc62853db94c471298a8e9fa195e8d9f'
                    }
                    test_sc14_br_insert_invalid: {
                        table: 'sys_atf_test'
                        id: '6ad3ef477fc44d908b4af83ba62359cb'
                    }
                    test_sc14_br_insert_invalid_step: {
                        table: 'sys_atf_step'
                        id: '3d0c7bd69fb8497c83d4352372cafaa4'
                    }
                    test_sc14_br_insert_user: {
                        table: 'sys_atf_step'
                        id: 'd2d9260808764fd8bc848ad8c529fda7'
                    }
                    test_sc14_br_update_entity: {
                        table: 'sys_atf_step'
                        id: 'c59d061bfec74c508aa18a171a37a849'
                    }
                    test_sc14_br_update_invalid: {
                        table: 'sys_atf_test'
                        id: '5edcc9125ea64d89ba9a3d877407bf63'
                    }
                    test_sc14_br_update_invalid_step: {
                        table: 'sys_atf_step'
                        id: '7a8f4a1d91f5400a98737d475a6e097c'
                    }
                    test_sc14_br_update_invalid_validate: {
                        table: 'sys_atf_step'
                        id: '468c098695074b01b3b98da19fb0621e'
                    }
                    test_sc14_br_update_received_on: {
                        table: 'sys_atf_step'
                        id: '0da20af899b748eeb9607cc09a153e2a'
                    }
                    test_sc14_br_update_seed: {
                        table: 'sys_atf_step'
                        id: 'b2d316a958524399a15fa5c71ebc5626'
                    }
                    test_sc14_br_update_user: {
                        table: 'sys_atf_step'
                        id: '41b003f7efe648ac934adaef5970bd82'
                    }
                    test_sc14_br_update_valid: {
                        table: 'sys_atf_test'
                        id: 'ff627f6a9f554cb9b6afdf4393c2b962'
                    }
                    test_sc14_br_update_valid_step: {
                        table: 'sys_atf_step'
                        id: '860cc68d64994b57a55e3b9bde02eed3'
                    }
                    test_sc14_br_update_valid_validate: {
                        table: 'sys_atf_step'
                        id: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                    }
                    test_sc14_br_valid_entity: {
                        table: 'sys_atf_step'
                        id: 'f62b397ec62049bc967521992592cbba'
                    }
                    test_sc14_br_valid_seed: {
                        table: 'sys_atf_step'
                        id: 'e8bcf8b1f14f42328096fe43135a2f41'
                    }
                    test_sc14_br_valid_user: {
                        table: 'sys_atf_step'
                        id: 'd4b6c57796b04c098cd5f9fb464c6957'
                    }
                    test_sc14_inquiry_util: {
                        table: 'sys_atf_test'
                        id: '51af5b8960cb4e7d9a16d5da63235d41'
                        deleted: true
                    }
                    test_sc14_reply: {
                        table: 'sys_atf_test'
                        id: '462b5e79304e49b7b56a2e0d7405f625'
                    }
                    test_sc14_step_assign_reopen: {
                        table: 'sys_atf_step'
                        id: '80b84451e9544c1aae7c3276410bf9eb'
                    }
                    test_sc14_step_reply: {
                        table: 'sys_atf_step'
                        id: '286505154e094dc98214ffdf6342b9d3'
                    }
                    test_sc14_step_util: {
                        table: 'sys_atf_step'
                        id: '626df8a7753a4f32a09811a88224476c'
                        deleted: true
                    }
                    test_sc14_step_validate_reply: {
                        table: 'sys_atf_step'
                        id: 'de07742e5b3e44ada9012477f17b7109'
                    }
                    test_sc14_validate_reply: {
                        table: 'sys_atf_test'
                        id: '32a548fb49254a89810a4950281a0263'
                    }
                    test_sc15_dashboard: {
                        table: 'sys_atf_test'
                        id: '59d3dcc61d80443ebef82708bc1f73ea'
                    }
                    test_sc15_step_dashboard: {
                        table: 'sys_atf_step'
                        id: '97c07d08d34a44458e8b625de855d82e'
                    }
                    test_sc16_acl_create_user: {
                        table: 'sys_atf_step'
                        id: '220169c003db43af9453e7b8d3426330'
                    }
                    test_sc16_acl_insert_denied: {
                        table: 'sys_atf_step'
                        id: '9024bef0a6a344ada7cc3f6baf1bdede'
                    }
                    test_sc16_master_acl: {
                        table: 'sys_atf_test'
                        id: 'eabf5cd4ca2c4c919d3136f59085e658'
                    }
                    test_sc16_master_acl_config: {
                        table: 'sys_atf_test'
                        id: 'e94a5113417d477dbf9a58ec407505c7'
                    }
                    test_sc16_master_data: {
                        table: 'sys_atf_test'
                        id: '90d15359339145dfa2540f16e42d1deb'
                    }
                    test_sc16_master_unique_code: {
                        table: 'sys_atf_test'
                        id: '0d6afac4ae7548659a5f160b524d0f05'
                    }
                    test_sc16_rate_values: {
                        table: 'sys_atf_test'
                        id: '0233d271e75947ee935f8e1574fac40e'
                    }
                    test_sc16_step_acl_config: {
                        table: 'sys_atf_step'
                        id: '06f9167b672249b3bf147025131b5b9f'
                    }
                    test_sc16_step_data: {
                        table: 'sys_atf_step'
                        id: '1bcd0bd10f2e4a939fa40be282af67bd'
                    }
                    test_sc16_step_rate_values: {
                        table: 'sys_atf_step'
                        id: 'ea3b16c7147546049da8cc32ffc23bc5'
                    }
                    test_sc16_unique_code_step: {
                        table: 'sys_atf_step'
                        id: '84c1ad1f66454764bac4d30ed6b4c392'
                    }
                    test_sc17_report_filters: {
                        table: 'sys_atf_test'
                        id: 'e2f88184c24e4d90b87da229193e0c08'
                    }
                    test_sc17_reports: {
                        table: 'sys_atf_test'
                        id: '08f813f486cf442c8a09e04d6fa2d543'
                    }
                    test_sc17_step_filters: {
                        table: 'sys_atf_step'
                        id: '93b476b1492d41d388bfbd7788af75c9'
                    }
                    test_sc17_step_reports: {
                        table: 'sys_atf_step'
                        id: 'e36972df96764f29ba18d37e867fc4ac'
                    }
                    top_col_cards: {
                        table: 'sp_column'
                        id: 'c06af976dbe548b68116325d08bb3468'
                    }
                    top_col_hero: {
                        table: 'sp_column'
                        id: '2b51241d11d9467282c9ea22b3cd76c4'
                    }
                    top_container_main: {
                        table: 'sp_container'
                        id: 'f40fa8eb7ded4abdba0f681ca62ca89e'
                    }
                    top_inst_cards: {
                        table: 'sp_instance'
                        id: '1b448b11f50149dc91d256d81780e6d7'
                    }
                    top_inst_hero: {
                        table: 'sp_instance'
                        id: 'f90e63f5993141c18fb5d764b172f560'
                    }
                    top_row_cards: {
                        table: 'sp_row'
                        id: '729e725a3d454dc8a475246aa143d472'
                    }
                    top_row_hero: {
                        table: 'sp_row'
                        id: '25c6960661bd48419d0130fbdb759f16'
                    }
                    ui_action_award_approve: {
                        table: 'sys_ui_action'
                        id: '0ccdabf278f4415ca6526e33f3561eed'
                    }
                    ui_action_award_reject: {
                        table: 'sys_ui_action'
                        id: '969407a0aab34168813b190e3d7401c1'
                    }
                    ui_action_award_return: {
                        table: 'sys_ui_action'
                        id: '2301b4f8ddc64051961e205a53254a24'
                    }
                    ui_action_credit_cancel: {
                        table: 'sys_ui_action'
                        id: '0fd298ec5f1d46b19f6ac86f05d0a665'
                    }
                    ui_action_credit_judge_exempt: {
                        table: 'sys_ui_action'
                        id: '03b3531cc65b4b12b055d5df8a35567e'
                    }
                    ui_action_credit_judge_required: {
                        table: 'sys_ui_action'
                        id: 'f69a62ebe3ed46498bbcdaa233d0bfd6'
                    }
                    ui_action_credit_receive: {
                        table: 'sys_ui_action'
                        id: '08efccdbea1e48c2940ed36342e55f91'
                    }
                    ui_action_credit_remind: {
                        table: 'sys_ui_action'
                        id: '1d52bee233404a4a9402093a85a54341'
                    }
                    ui_action_credit_request: {
                        table: 'sys_ui_action'
                        id: 'a9968150bbf94a9e85ec8fde7a080e4b'
                    }
                    ui_action_inquiry_assign_to_me: {
                        table: 'sys_ui_action'
                        id: 'cefc34460a364958a14d7db48278c4ea'
                    }
                    ui_action_inquiry_reopen: {
                        table: 'sys_ui_action'
                        id: '28599088303940be8dbbfb380235134b'
                    }
                    ui_action_inquiry_reply: {
                        table: 'sys_ui_action'
                        id: 'c04d355a69054f55b9392041a24800fa'
                    }
                    ui_action_notice_publish: {
                        table: 'sys_ui_action'
                        id: '8661e15c4b7247659881f33b285915c6'
                    }
                    ui_action_notice_unpublish: {
                        table: 'sys_ui_action'
                        id: '973c554112154830917c6c470799e685'
                    }
                    ui_action_registration_approve: {
                        table: 'sys_ui_action'
                        id: '3055b9d890a64fbc910da08e3ff36088'
                    }
                    ui_action_registration_reject: {
                        table: 'sys_ui_action'
                        id: 'b5456289ce59435b82d242a2f8d65f08'
                    }
                    ui_action_registration_request_defect: {
                        table: 'sys_ui_action'
                        id: '0976c4e239e643d48c90500b1a24911d'
                    }
                    ui_action_review_assign_to_me: {
                        table: 'sys_ui_action'
                        id: '93a413533245418894d89d425feba32b'
                    }
                    ui_action_review_complete: {
                        table: 'sys_ui_action'
                        id: '35f903e70c5f424b99790c1141e44c69'
                    }
                    ui_action_review_reject: {
                        table: 'sys_ui_action'
                        id: '901abfce4da242a5ad1f70be89d2f28e'
                    }
                    ui_action_review_request_defect: {
                        table: 'sys_ui_action'
                        id: '3e21d626f50042369e16119d2a5ba749'
                    }
                    x_dent2_dentsusoke_app_defect_fix_link_script: {
                        table: 'sys_script_email'
                        id: '94260e5e7a0444ae80b919903eb63d78'
                    }
                    x_dent2_dentsusoke_app_defect_form: {
                        table: 'sp_widget'
                        id: '3a7a6e8970624a1fa10a2ee1493abaec'
                    }
                    x_dent2_dentsusoke_app_list: {
                        table: 'sp_widget'
                        id: 'a00aca7af2224b06a5bb5cd7778aa08d'
                    }
                    x_dent2_dentsusoke_application_form: {
                        table: 'sp_widget'
                        id: '386339f6c1084031b1ef8d280515f471'
                    }
                    x_dent2_dentsusoke_coming_soon: {
                        table: 'sp_widget'
                        id: '7bbda4b9ba1249bf86ee6ef01ccdf3f8'
                    }
                    x_dent2_dentsusoke_confirm_form: {
                        table: 'sp_widget'
                        id: 'b28c3537ee42419c9151982e1401b4d8'
                    }
                    x_dent2_dentsusoke_defect_fix_form: {
                        table: 'sp_widget'
                        id: '1431759ff431490492ac9ea6f837b0db'
                    }
                    x_dent2_dentsusoke_defect_fix_link_script: {
                        table: 'sys_script_email'
                        id: '7c1f3120b52d42f7b82480001ab6e90a'
                    }
                    x_dent2_dentsusoke_document_form: {
                        table: 'sp_widget'
                        id: 'f2672cbd10c6413689ae31f115f805e2'
                    }
                    x_dent2_dentsusoke_expense_form: {
                        table: 'sp_widget'
                        id: 'd7715f80da2f43ebaa9ab429ef5e63d1'
                    }
                    x_dent2_dentsusoke_inquiry_form: {
                        table: 'sp_widget'
                        id: '8f7ed738854248318040e9f51c000fc0'
                    }
                    x_dent2_dentsusoke_login_links: {
                        table: 'sp_widget'
                        id: '30343c57eacd43038890714998df065c'
                    }
                    x_dent2_dentsusoke_main_menu: {
                        table: 'sp_instance_menu'
                        id: '4fcd7062c1824ae282fc818dc850303c'
                    }
                    x_dent2_dentsusoke_mypage_apps: {
                        table: 'sp_widget'
                        id: '3448cb08c99849d790627bd57106c0ca'
                    }
                    x_dent2_dentsusoke_mypage_notices: {
                        table: 'sp_widget'
                        id: '96cc01107af044e58db3849da25e5bc9'
                    }
                    x_dent2_dentsusoke_mypage_summary: {
                        table: 'sp_widget'
                        id: '610cb7a35f2e4ee595e6266a62a25d92'
                    }
                    x_dent2_dentsusoke_notice_detail: {
                        table: 'sp_widget'
                        id: 'f38067665c054d50a090ecbf33370019'
                    }
                    x_dent2_dentsusoke_notice_list: {
                        table: 'sp_widget'
                        id: '1cad3a7fc31546abb787aba708c64461'
                    }
                    x_dent2_dentsusoke_password_reset_event: {
                        table: 'sysevent_register'
                        id: 'a7b8970715f8451e95b38d31c09e12b8'
                    }
                    x_dent2_dentsusoke_password_reset_link_script: {
                        table: 'sys_script_email'
                        id: 'fe0e5e9bc76f4842aef6a3763e7e4429'
                    }
                    x_dent2_dentsusoke_password_reset_mail: {
                        table: 'sysevent_email_action'
                        id: '5eb13ea5fbe34cacac57111010107a55'
                    }
                    x_dent2_dentsusoke_portal: {
                        table: 'sp_portal'
                        id: 'f8492d5e3d6a4fc8b0f57c70d0259d07'
                    }
                    x_dent2_dentsusoke_profile_form: {
                        table: 'sp_widget'
                        id: 'e93e51b1aeaa49db9c34ce4afd9c405d'
                    }
                    x_dent2_dentsusoke_register_form: {
                        table: 'sp_widget'
                        id: 'cd1267371f3c4b24af22e55c3d39c259'
                    }
                    x_dent2_dentsusoke_registration_defect_event: {
                        table: 'sysevent_register'
                        id: 'c650e178b58e48438e9a62b9188109c4'
                    }
                    x_dent2_dentsusoke_registration_defect_mail: {
                        table: 'sysevent_email_action'
                        id: 'ed193538fbe34dca901e808e349d4c8c'
                    }
                    x_dent2_dentsusoke_registration_invite_event: {
                        table: 'sysevent_register'
                        id: 'e503285fcad749b48c324735cb753639'
                    }
                    x_dent2_dentsusoke_registration_invite_mail: {
                        table: 'sysevent_email_action'
                        id: '7e25a28efd89467ca6052d306da64ce2'
                    }
                    x_dent2_dentsusoke_registration_link_script: {
                        table: 'sys_script_email'
                        id: 'f8a40e8d3b3d4014955abb6b2b0a58a5'
                    }
                    x_dent2_dentsusoke_request_defect_event: {
                        table: 'sysevent_register'
                        id: '579b277ef2e84ad594d8d760ed6c69b1'
                    }
                    x_dent2_dentsusoke_request_defect_mail: {
                        table: 'sysevent_email_action'
                        id: '4f3726b59d3e4597b202c3100174db23'
                    }
                    x_dent2_dentsusoke_reset_form: {
                        table: 'sp_widget'
                        id: '4e5345e3051c4a91a7197f260957a6c9'
                    }
                    x_dent2_dentsusoke_signup_form: {
                        table: 'sp_widget'
                        id: 'ba28cd70e5264c518b7c8de6cf65a41e'
                    }
                    x_dent2_dentsusoke_staff_nav: {
                        table: 'sp_widget'
                        id: '58baafcfd09d46deb7cd2ffdd4e91949'
                        deleted: true
                    }
                    x_dent2_dentsusoke_top_cards: {
                        table: 'sp_widget'
                        id: '8c1e7aeec18d4db09904116a8997b3e8'
                    }
                    x_dent2_dentsusoke_top_hero: {
                        table: 'sp_widget'
                        id: 'bcfb89dbd6084115b11254acaa313a3e'
                    }
                    x_dent2_dentsusoke_user_review: {
                        table: 'sp_widget'
                        id: 'f320e324778a4bab98fa46b4157249eb'
                        deleted: true
                    }
                }
                composite: [
                    {
                        table: 'sys_ui_section'
                        id: '001db395750c485db9a57dbd6398997f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '一次審査'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '00688d0fec26432b8ee27d5610e7360a'
                        key: {
                            document_key: '860cc68d64994b57a55e3b9bde02eed3'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '00a897529a9b47b8aa93f5cac10076e2'
                        key: {
                            sys_security_acl: 'd143cd4b2fa94bba9177e5343047389b'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '00f7c37f3ccc4819848c2b6c77837884'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '信用調査・採択判定'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '01199eb0b8c54a7ba010d0bf72e46453'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_requested_on'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '01207bab8ceb4ee1a8597542b6f9312b'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_salesforce_account_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '015d32cb7deb4318b71f9ea0ffb5461c'
                        key: {
                            sys_ui_action: '08efccdbea1e48c2940ed36342e55f91'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '019979e77ff04375ab62dc2fbf777983'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_sso_external_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '01e6dbacb1a940788151d861ecc537f3'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_mfa_enabled'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '02045205ce2148c4b4b3f4968dbbbb69'
                        key: {
                            sys_ui_section: {
                                id: 'd65b71a023394995aa0110967d3ea132'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_credit_judged_on'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '028b5d90f2974e03a6544023166c59b4'
                        key: {
                            document_key: 'eb8860d62f6746668ac30d01dae0f943'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '02c043b3dd064fb08ecaf3e7a071517d'
                        key: {
                            id: 'x_dent2_dentsusoke_app_fix'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '02d0ede39d6c4893817b906ed7eef994'
                        key: {
                            document_key: 'd4b6c57796b04c098cd5f9fb464c6957'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '02eaaaa8ed4144c9b4f8206a45f312a4'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '031667691bd446ff954836a5b5ddeec9'
                        deleted: true
                        key: {
                            document_key: 'b1bb365075cc4073a96b41c3993ae896'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '033e06ab7bc544f983771df02f2b48ad'
                        key: {
                            document_key: '3afc11d62da2461f927dbe2351c8fa1f'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '03b2031fa33447bbb9c7081bc99c3e27'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_code'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '04486762ddbf44b7bb07520205073682'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: '6f69fc4aff6433008d3f5d9ad53bf18c'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '04be6609db5e459589c621725f0e83ad'
                        key: {
                            sys_security_acl: '8c9236999e6d41ef8533ececc9fa3c26'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '04f14a6577b142b0977c47f28826a4c2'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reviewed_by'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '052db3a9202e4d6a9f87f2ef28097c6e'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '05321741cf19441bbe00c832764def8f'
                        key: {
                            document_key: 'e8bcf8b1f14f42328096fe43135a2f41'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '05c16100820347bea393ded229d4ce5f'
                        key: {
                            document_key: 'd2d9260808764fd8bc848ad8c529fda7'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '05fb51fc399d42a999a64cf229436b42'
                        key: {
                            document_key: 'b2d316a958524399a15fa5c71ebc5626'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '0677c1f6bed645c9b43f309352dd7b9d'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: 'd2d9260808764fd8bc848ad8c529fda7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '06d50f1394da4b1594b705a0d39ed4e4'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '070a2c9f840c4dc697a4661a19d42325'
                        key: {
                            role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                            contains: {
                                id: '190a591723b64462bfee930709be24f2'
                                key: {
                                    name: 'canvas_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0731b23e6cfa408ea942d8a2ccd18005'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_agency'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '077e48f9beb3498d8118ae9eb8038ebb'
                        key: {
                            document_key: '3ace2ab433fa4561bfdcbdf9ec406a3b'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '07a7dac6f2004704a791ee6c892c9c6b'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_name'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '07f8446b14fe455486d6e7514a867f14'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_user_type'
                            value: 'manager'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '080abe2cb3c74913b3c93b93de16da36'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_received_on'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '082c7b61e9f2408ab8b3d753db3bdf68'
                        key: {
                            sys_security_acl: '4ccdb7cd02f34a639c7cf2676d4c35bd'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0835740f34fe41b9b1c7f3f211340ade'
                        key: {
                            document_key: 'd2d9260808764fd8bc848ad8c529fda7'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0840539ccebc48d5b5ef48837fc8c3f0'
                        key: {
                            document_key: 'a1c041af46e6490580c6fa076b4f233f'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0856868c2a5b48f6ac5bd25d1b9c3752'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_updated_by_staff'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '085fe355cfbe40ce94292cc644d04177'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_organization_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '08d0fe9922244d1189d0784b7e4d5fa2'
                        key: {
                            document_key: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '08d7eba629744b729f66f5cbed0ae612'
                        key: {
                            sys_security_acl: '4096df523fed45fca7c880c5d06a4db4'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0994823581ba4aefafcfabd96f05a9ea'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_from_status'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '09a0b8501370493eac308aa7d6b3d2ea'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '0ce38091504a47e3b6886ab7376424b5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '09b2d6865def48a18933b1b62b1a89f3'
                        deleted: true
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'b1bb365075cc4073a96b41c3993ae896'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '09d4cbff483141e4a50ebae3607aeb84'
                        key: {
                            document_key: '3956b78f24e040eaabce6e58f2ae4930'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0a349980dbd149faaa74bbd108379927'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_request'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0aca36740e2c409a849aca8e721e0492'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b355ce40f214c9bb05db6b7b52845cf'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_user_type'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0ba13fca11c441c8b43f6c3b41d63f27'
                        key: {
                            sys_security_acl: 'd143cd4b2fa94bba9177e5343047389b'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0ba9e287821944158af9fc2bc9346879'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_description'
                            position: '10'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '0bbe995742a24d378d30a0ff3feb59af'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0be2babc345247f6804ec93536c10be4'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_auth_method'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0be45a65ae56403095da5da54efc087b'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_required'
                            value: 'required'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0c10df12b22d4d0aafaeeb2a5b7e8046'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'first_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0c2a8cc4756640e2ae0f011a1795e397'
                        key: {
                            sys_security_acl: 'e368986f983c4ed9a4de9a694260df0d'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0ccb99464352434ba2931884a73143eb'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_request'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0cdf736b4f5c4aa8a752177bda1bf88b'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_capital_limit'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '0ce314e89cab49d19a029bf8c6f5be18'
                        key: {
                            sys_ui_action: 'cefc34460a364958a14d7db48278c4ea'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '0d02b3ea0ceb46649a40f5066e47429c'
                        key: {
                            id: 'x_dent2_dentsusoke_notice'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0d0452816b614e20bf6bb4d124908bd0'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_rate_denominator'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0d08f025ef5648869ddf39daeedd78aa'
                        key: {
                            document_key: '06f9167b672249b3bf147025131b5b9f'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0d107ee18e104e67a5d4d92904fa2f83'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '0d693360d03c437d86454625f17f5fd9'
                        key: {
                            sys_ui_action: '28599088303940be8dbbfb380235134b'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0db3aa3327dd42b38ae2c7f702b55b6f'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_auth_method'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0de1baf8227c4a3ea6643fe34cd3c501'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0e0b9c4da56c4cd5a3e1a7af8ecea50f'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_award_number'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '0e383da41c26413c8b98d4fc298fe001'
                        key: {
                            ui_action: '2301b4f8ddc64051961e205a53254a24'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '0e49d581919c4d719c0d1c29f4367709'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '78f17fcceabc40bba114af1b20ec0e6a'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0e8a1d95b1fc4ffbb36c342df2b372f5'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0eafcea6e2334bd0b1de58c70341aaa7'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            value: 'le5'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0ec22cbd844145399fd4b1d328d8c879'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '0ecfa9a465aa47298223cf3e1122667c'
                        key: {
                            sys_ui_action: '35f903e70c5f424b99790c1141e44c69'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0ef19be3909f415bb4dd176fd4335ef0'
                        key: {
                            sys_security_acl: '21cb3f68b05c4bef884fc38ab7f382f6'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0f3a140823494521868d09e035b2f1dd'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '0f4cee451039469fa06af8b38d225ffa'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0f6fdc2b3533489d824c98b4ee5fe291'
                        key: {
                            sys_ui_section: {
                                id: 'd65b71a023394995aa0110967d3ea132'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0f7a7ed160904de8b51d69bce00a98d4'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_daily_cap_amount'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0fa1402960f44593a4ecb959595c8923'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0fa966dda7cf4e03a48f559c2e1a3e57'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_cap_amount'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0fb6e652e77742fd8a9d20d56f330ffb'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0fb9c55bc95247dd8c7f823322069d27'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_business_entity'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '10055d00a7b74d8fb482cb4751b69557'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_prior_year_award_number'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '100b52bc774644d29ddd1884b2445cf5'
                        key: {
                            document_key: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '1096453f73704b68bba508a7f2e4c378'
                        key: {
                            ui_action: '03b3531cc65b4b12b055d5df8a35567e'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '10f45ce0f653479591bbb9ba9288aeb4'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '10fdf897966d4ca3b289b5f0fbf1c279'
                        key: {
                            sys_security_acl: 'c3f7690995cf41778db24a47c0ea7c16'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '110df8cdfb2b436b97ef2ff4f237a097'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_sales_increase_target_month'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '117e1a48ce284cdda77f649f8bf5446f'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_result'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1196cee2adaf4855927344b24dfe0261'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_review_due_on'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '127ab3de2f594fc6b9ed068defc92334'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '136f5cce01ee4773a36292fa6c3f0634'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '136fbf2180db44a89776c0e6a1d8c186'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_defect_fix_expires_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '13db75520e0945a1b808df08e2254237'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_token_expires_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '145956f0813448cfb73ac430a383ebe3'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_code'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '145b51491e4b450392e04e9ef3fdba80'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '148592a88db14e268faffc70e66f4117'
                        key: {
                            document_key: '5b446558b2094756bb9666a5292e05f5'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '149a38bd2e3f41e7a43aa8d4b73500e8'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '14acb135bcb54850b1b592265fa5f143'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'email'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '14fff700bc6348ada4b59f652e7778b4'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_credit_required'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1501b3947f464f85a2735b6d628606b0'
                        key: {
                            document_key: 'f62b397ec62049bc967521992592cbba'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '15e47851ed7c469da8df6c16422cb47b'
                        key: {
                            sys_security_acl: '1887d73c2b774c298dcf2c1700fa8c14'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '15ebef9b1e864e57b77ff76fc08a5da8'
                        key: {
                            document_key: 'e36972df96764f29ba18d37e867fc4ac'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '163a4d8ad3414d77a23e9c35a37ac553'
                        key: {
                            document_key: '0da20af899b748eeb9607cc09a153e2a'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '165d13eb33f24094aef4085719615884'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1684ada9af554978b01fec19d0c063b6'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1690d6aa2f2f45dba76b04c11d8aa65c'
                        key: {
                            sys_security_acl: 'eaf3c900849841cfa80acd77d1c42b76'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '169e85e36e694525909f8eeaadffa62e'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_status'
                            value: 'private'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '16d367c933c947d688712a297cc95a43'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_organization_type'
                            value: 'sole_proprietor'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '16d863b14ce24cbe8daed274b6df8ce3'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '16dcede83b024ac8ba5ec065a68beb2b'
                        key: {
                            sys_security_acl: '1fb9371d8f9441a9994a78cdfbca42ff'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1711bb03d4944d0e8b5a3af029e9e67e'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_received_on'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '175397d0281e4b729454bcfc6d06ade8'
                        key: {
                            document_key: '0da20af899b748eeb9607cc09a153e2a'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '17b966f014a0480fac5b6ba69c0b10dd'
                        key: {
                            sys_ui_action: '3055b9d890a64fbc910da08e3ff36088'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '17f445879fe04791b08800d98c366088'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_due_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '185134f88a994d758522e82e1acaea6b'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_due_on'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '185ab01b1ee14c87b06b88996c6d24c9'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '189a1d6a110b4b0f84c265185859dd88'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'last_name'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '18bfb15dca024d35be53e404a7bd4c01'
                        key: {
                            role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                            contains: {
                                id: '74d70b5b65dc4f7f89501e7c10aab6cb'
                                key: {
                                    name: 'user_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18ef222254db4886ae14d2912fe8c574'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '18f8fbc4462f486ea4658d5b5e2dcf37'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'e36972df96764f29ba18d37e867fc4ac'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19179addc44843bfabafa4d30db17dc4'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_business_entity'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '19766e0fc1c4474f83413f785e2fe0a4'
                        key: {
                            sys_security_acl: '82a990bb2f8c4ac9ac238228535bb5b4'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '199a94fddf9b4c84810d9e1396dc2c2a'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            caption: '専門家経費日額上限'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '19c8bcdef71b4ca9b5c47f78b5dcb9a4'
                        key: {
                            sys_ui_form: {
                                id: 'b3101824f4284674b10b1a5a88ad6362'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '19ef45fba185467f86ae72a5db15be77'
                        key: {
                            sys_security_acl: 'aa119d1e996744118ba24574f42e0f01'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '1abb9fd8a6ea46a497a6cd75667eca0d'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '3ad79e075f20447c81d848de27c495de'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1b5f30b272a4454199e9ca4c747f9c24'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: '1778a7480f20101091d0f00c97767e03'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '1b80b18eca6d4c928fbcde8a4cae011d'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1b903d5a427e497899c4b58a3ae243bf'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_business_entity'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1bcf2941c3ac453bb30906e1044ceb45'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_request'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '1be51c669cb84f1a8ae3dde8e0fc5e02'
                        key: {
                            sys_ui_action: 'a9968150bbf94a9e85ec8fde7a080e4b'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1bed0c77e75d416b9a07362fa8a13b77'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_read_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1c05053e5b16430885860ca2698b63bb'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_due_on'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1c376751c81e4dcca99aa7e20d311218'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_state'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1c428a27d086455cb89b199935e5d8e8'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1c5cca1a01704174bb2577c8afe4f081'
                        key: {
                            sys_security_acl: '3e8e67c3a2c1446c89bfe1f0c050c565'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1c7c506e2dc44602bd6d479b650974a8'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_sales_increase_target_month'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1d1d69e3b21d4e899068d9c8e09ba378'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            value: 'sales'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1d4160032c164b349d9a7d61ed6d4b26'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                            value: 'cancelled'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1d7643d321634e4d86f14ed393b60539'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_file_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1d7a26d10cf44449ad2da2e9b6892c57'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_actor'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1db225d6067340d2a36e3241a1a30a1f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'ext_reviewing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1db6a21e28c64c2c9e781233391eee97'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_business_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1de4c4a78a614c618726e25e9a78f97e'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'withdrawn'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1de966c9dfb7461c872f4a01f3d69493'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '1e06ff1b955249a3871baa72253d8e70'
                        key: {
                            sys_ui_action: '93a413533245418894d89d425feba32b'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1e2a31f0eff645338838ca0335864e68'
                        key: {
                            document_key: '9af9abfe59284966acab733ee817b62f'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '1e54565a3b2c44ef8a771a6b62610446'
                        key: {
                            sys_ui_action: '973c554112154830917c6c470799e685'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1e67b4b4a49d49dbba1cd2f7e06d0895'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_employee_count'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1e8753dbfecd426ea8534aace1a1ecfa'
                        key: {
                            sys_security_acl: 'ead71ef95abc4f11a75925ad96714cfb'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1f269554dfe24bc6b86b604360260dd7'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_registration_requested_on'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1f8aadb3ede74f5ab102ecb049f0347a'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1f9e9c9c702b44858d8a1e9abdf7bee6'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'defect_request'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '20857ec0b8e64967925a88f0111bd6e4'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_withdrawal_flag'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '20da5b64e77a49b9a986291c42d6b9b4'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_read_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '210dbdd927ef49e6808b197b45ca28e9'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_has_daily_cap'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '211884b9f9d346229dfe8a6ff62bb4d4'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'review_done'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '21233710ff96401e99293701607b86d1'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_approved_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '21245fde032246b7b4d17d149172d4eb'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'withdrawn'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '2159c0a2f1964826bb90cfcba58841d4'
                        key: {
                            id: 'x_dent2_dentsusoke_top'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '21c9df7c869d4c9cbb82289e4e452a95'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '21eaa37d8a0b45059d3093a77b0a3c84'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '223e16689da448f78d178f24ca4115c1'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_result'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '224ed7bae03049f09f3be5ba756c0c0a'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '226fea6e66804cf29dd2ff224f2bdff9'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '22cdc58ede384284a127e80c131d4a8b'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_password_reset_expires_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '22d75b6a2cf140688ab6eca68b19680a'
                        key: {
                            name: 'x_dent2_dentsusoke.applicant_admin'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '22dbf4945ca543889565a20af2ed2768'
                        key: {
                            document_key: '9024bef0a6a344ada7cc3f6baf1bdede'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '23488e7d2ce749f0ad2a7faa136b3e7f'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_approved_expense_amount'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '236f326a3fa84bf781650eb622365cd8'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'accepted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '247bf891b8a447048d6757c735a1df84'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_auth_method'
                            value: 'sso'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '24a73076d0274fb29db7192d5434a4fe'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_user_type'
                            value: 'member'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '24ae90a064524fa6b97805375bc8a038'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '24af6bc535224012b48186a79ed33e2d'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'fe36860a15494614a3b1b312a45ff629'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '24d9d03fdffd4defabed356ebecae841'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_employee_count_category'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2547d72ef871408694571b0fc34d8017'
                        key: {
                            sys_security_acl: '7e1bb748e0d948c5ae40aedac2ddd532'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '256a2c8783094de5b9dd3315a7e5a041'
                        key: {
                            document_key: 'ae335397fb1540b7ac958c128a54168f'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '25874a06c3f34d118707b815aedcac04'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '25a474b0e8c945d49813990b038e05e7'
                        key: {
                            ui_action: '0ccdabf278f4415ca6526e33f3561eed'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '25aa265ab7f34dd1a2cbc2b263e12805'
                        key: {
                            id: 'x_dent2_dentsusoke_login'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '25c2e029ac634516b12f5adb398e4985'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_code'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '25dd96ee9968450c9c59b5581b11caf2'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '26097d2d82d64c82b17d9b30f5a1a3f6'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_replied_on'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '2609a88a39dd463eb27e23adf313b40e'
                        key: {
                            logical_table_name: 'x_dent2_dentsusoke_req_log'
                            col_name_string: 'u_request'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2639c46c937445c2b754851058e0230e'
                        deleted: true
                        key: {
                            document_key: 'b1bb365075cc4073a96b41c3993ae896'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '267c0704004f4b80849223a8125c2ea0'
                        key: {
                            document_key: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '270485115e5f4bbb80541589612a822f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_rate_numerator'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2716ef7f619945f196a4c710223c9fa3'
                        key: {
                            document_key: 'e8bcf8b1f14f42328096fe43135a2f41'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '273104e646a84f18a812cefbff088c8e'
                        key: {
                            id: 'x_dent2_dentsusoke_defect_fix'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2736c664bc0f4c809b4c5a5ea3d951dc'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_created_by_staff'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '273b37d64e8445b6a476bf520400b3b0'
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_defect_reply'
                            position: '2'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '2764e36d86ef473ea3ce74540fa2ecb5'
                        key: {
                            id: 'x_dent2_dentsusoke_reset'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '27a3811663874e5681bca7807bc85369'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'e93e38c5aecb4188996335b34267b38c'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '285b8ac48788462b937d093fddb7863c'
                        key: {
                            document_key: '3956b78f24e040eaabce6e58f2ae4930'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '2866214fe2064fd3919d808fd4d27f2a'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '28839f9aa90f474aa5b9a46d16c21f85'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '289c02b21fef463d8f9b70cdaee65d49'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_expense_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '28dcd6a9744044738d80f02069c7ec84'
                        key: {
                            ui_action: '901abfce4da242a5ad1f70be89d2f28e'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '292dee0947844180969423a4833cf46e'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_corporate_number'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '292ecadd514f4ce6a2621866e696d23c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_defect_due_on'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '2965d2995e04454da1a15eacc7767da4'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'bd11a71c166b4645bd312b494d53de27'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2979592a52154683beebbcc832d3a5f3'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_entity_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '2995932a5cae45e7afa78fccc054c293'
                        key: {
                            sys_ui_action: '8661e15c4b7247659881f33b285915c6'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '29b828ad149b46309a56b5b55f4ad1dc'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_total_expense_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2a383c4483cd4694909c4385fca7fc96'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_business_entity'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2a5b6495895a4466b7893f0a14577d84'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_decision_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2ad2d0fde684461abeb1f8fc7800dbd2'
                        key: {
                            document_key: '0da20af899b748eeb9607cc09a153e2a'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2ae0e3bb56804a238ffa9bb7f9bf4b57'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_visibility_scope'
                            value: 'all'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '2afe85853a174706a4160d4ff2049ea1'
                        key: {
                            ui_action: '93a413533245418894d89d425feba32b'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '2b03e6ebc7a14589afaeda4ad8963f54'
                        key: {
                            sys_ui_action: '1d52bee233404a4a9402093a85a54341'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2b31ad301ebc484ba0fe215f17634d50'
                        key: {
                            document_key: 'f09c19c4230e444da6ac926d7036a20c'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '2b917a3d96f94e2b8e8c7c3ca6c91484'
                        key: {
                            ui_action: '3e21d626f50042369e16119d2a5ba749'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2c5a5fc1c5d3486ba326d5c0e48ad87d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_credit_judged_on'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2cb3379584a5441f854ab9a014cfb193'
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reject_reason_code'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2ce8756d46974341b7e864af74fdcb65'
                        key: {
                            sys_security_acl: 'b7fb5f02e76a46abb9ce633c09ad8b10'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '2cfef81571e54d4089d0ebf70c9d8eac'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            id: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2d0a0917a8ca4573bdcd80338d6e1e46'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '2d0a34549f104f078d5a012603d9294f'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2d298a0e9228427094b63e203bd235d3'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2d3cc642b45147bbadfd16c50439941a'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2d45f48e15294941b904588822deba08'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_email_notify_flag'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2da0007e69e1422f80c2e5a76c02748c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2daa821ae6a14e08971cdbe658efd36e'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2db81418bbea4532a586158db094b27f'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_description'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '2dc27031d40b4d4b9e9975ecbcc55fba'
                        key: {
                            role: {
                                id: '22d75b6a2cf140688ab6eca68b19680a'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant_admin'
                                }
                            }
                            contains: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2e0f49d829f04837bba97ff5333e4ee9'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_title'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2e2af9b8e1034909a3a1582f48e8d496'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_has_daily_cap'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2e52e332aca64d3591259c2adb3d7ca7'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_assigned_staff'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2e5822389a2a4380865938a72963f0d1'
                        key: {
                            document_key: 'd2c22318dbc14f73a7f78dd79d792ce5'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2e664a33ace845a39930cc411ce93e42'
                        key: {
                            sys_security_acl: '1e0bbdb0c70d40fdaec8ee6df5c3b7fd'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2f46adfaedd848579464174af4a041f4'
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_defect_note'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f6202ee3746496c8b99ceb189b00304'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            value: 'le100'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2f724abd71cc409587f0602415eae3e3'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2fbce1e7549f413bbdb21c7a02733320'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_special_measure_flag'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2fbf46dcc4a94719946d6d326682f2f9'
                        key: {
                            document_key: '97f75e9464f74979b8e61e63c3347c33'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2fdbbe25638245119ef57bbdc29772d9'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_rate_numerator'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '30216894a8ee45609ac1cb0da2b7fbd7'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3048b091e59c4550b411da862f659346'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_result'
                            value: 'ng'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '30aa7e842e1346c89903045da77927be'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '30bc30f077064b8ca47bf3237aac6630'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '30c46795f5c4426e9df19654878c9268'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_note'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '310b8976bb1a4f23947fa07e83de1284'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_expense_category'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '31a8ebd946de41d8ad81356ef186c77a'
                        key: {
                            document_key: '7a8f4a1d91f5400a98737d475a6e097c'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '31bdbf1cd0ae4ad38ca616c98755b95b'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_state'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '31c0f0adcbf8402dbac427b386daece6'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '31d38c76dfc74127af056083f920b7a9'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '31fb89e78aed433fbc0751a14ae6622a'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '32360170923e4e638ad4e0c9dbb32f00'
                        key: {
                            document_key: '41b003f7efe648ac934adaef5970bd82'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '32d69c117ba2441cb0ebadbb04b4c5f6'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_note'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '32eed564355746c895664879e3002b52'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_amount'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '331b107c09644a45b06a1a6d6fca1b22'
                        deleted: true
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'd3e3ab4ff03442a88ec01a1991ee124d'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '33c19b330e9841ada97790256cd2f9cc'
                        key: {
                            sys_ui_section: {
                                id: 'd65b71a023394995aa0110967d3ea132'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '33d2e2d31cd247de969e939a068b9435'
                        key: {
                            document_key: '41b003f7efe648ac934adaef5970bd82'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3400089528d84a40b8a21214f2389165'
                        key: {
                            document_key: '33c713686aeb4f1084b670e990970a83'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3417d900a07c4050b22f4539241c0758'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_priority'
                            value: 'middle'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '3442315a354841769e99f9f9578fb3f0'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            caption: '補助率'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '34470e22508b409abcb8ce37a4ac268e'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '3525f7e3c41f47d39475d474518a41a8'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '3ace2ab433fa4561bfdcbdf9ec406a3b'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '35627896fc6b4e4684b893aacca52243'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '91a7b689ecc44b16a22862edd8d12d78'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '35ba657296fc44e2b38083f442ade93d'
                        key: {
                            document_key: 'cec016c6fab64bdab4ab8f2d5bc2c85b'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3609119ee70140dc8b667b24b7d80abf'
                        key: {
                            sys_security_acl: '828ef6027a7d44c69a8b0bea59f5a49f'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '367c50f9221540c0ac71f81daefc6443'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            caption: '調査結果'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '36cb0a24fc164014b3d1fa02c084b192'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_entity_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '373727651b2d4836ae82e361187dd16a'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '373e4904b0d844ee92dfdb79e3276c03'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'b0995324f3a24479acff4831b869379f'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '378d74eb3ebc4818a14b3f997cbfeafa'
                        key: {
                            document_key: '7a8f4a1d91f5400a98737d475a6e097c'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '37bd614f7390405ab43c87dff728fa44'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'cec016c6fab64bdab4ab8f2d5bc2c85b'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '37d656d23b4049f8abed0725c5afae7b'
                        key: {
                            sys_security_acl: 'b6e5540e58e34beaad2cadf17095302a'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '37d6f9cb55e74e50877a52bc2fb9c0aa'
                        key: {
                            sys_ui_form: {
                                id: 'a710fe79048c430b91c03ca1ad424651'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '386655724bb04b3d8cd0c7b8dbce9419'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '5072a249ec9e473f99a61cac84e6011c'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '38793882acef476eb3873646c2b899b3'
                        key: {
                            sys_security_acl: '25f52135f6f042c2a2ac852f11fee98d'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '388e463994394d648e50ec4818ce756e'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '286505154e094dc98214ffdf6342b9d3'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '38a14fdc1bc4408782da28eb7f7d0e7d'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '80b84451e9544c1aae7c3276410bf9eb'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '38a1851502134a1ebc6783da418a7e62'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '38d7eff8d9814b2287b9bc4f20759752'
                        key: {
                            document_key: 'b0995324f3a24479acff4831b869379f'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '38e80c89c0e542c9874178bd00db2399'
                        key: {
                            document_key: '97f75e9464f74979b8e61e63c3347c33'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '39251f6d760f4df19f941f6bfad724fc'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reject_reason'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '3943e1d7f804455ba9e6eb2beb53088c'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '395a0b421ef34dda9493adf6faa7ea06'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '39e05e3f01904c3689b5690c5b91cd98'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_replied_on'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '39f56547f4024830b161952a3f69823b'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '3a020157401c47a4a2834744031326c5'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3a6d6c6d0b68486dbdaf51c4e05506dc'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_request'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3a7bbaf009cb4ad18e650782c7b9a69a'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            value: 'expense_invalid'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3b4e908a31bc487495fcf7272c1d9903'
                        key: {
                            document_key: '5d0f6d8f09ee4ad4917d26c3ea17886e'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3b5edd71a3e4483ca44a949c2659239f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '3bbf6d468d06410ba82bafd2ba1bc7ee'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3be8b3118c604b08a8c587a55354c592'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            value: 'sole_proprietor'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3c0b1328163f42bb8bcd004a99df6966'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_address'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3c0e051ca9fa4888916e410bfb246c7c'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_approved_expense_amount'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3c24883d4b254466a5623ba038dd5cd8'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'service'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3c89f4491b88415dbc6bcdb44f1d9c6e'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3c8b6eb43aab4ae6a4e1aecc2ad8485f'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '3cc7c38e8a6d4762bf707d3b5e73d15a'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'a1c041af46e6490580c6fa076b4f233f'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3cdd44a7e5914cabb3d9bd4227c96b8f'
                        key: {
                            document_key: 'c59d061bfec74c508aa18a171a37a849'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '3ce201c3d36840b184a5b7f8df0acbf5'
                        key: {
                            ui_action: '973c554112154830917c6c470799e685'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3d10c06fc6a94573a7f33513b2b5c1db'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_state'
                            value: 'answered'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3d49665876684f0facad56810440fdc5'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_decision_note'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '3d4a97d82fe841c6a5973273917cbfe2'
                        key: {
                            sys_ui_action: '35f903e70c5f424b99790c1141e44c69'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3e41dea829d64380818701be2df3277c'
                        key: {
                            document_key: '91a7b689ecc44b16a22862edd8d12d78'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3f0067f9c8214415a8b9de60ee3009c8'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_start_date'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3f3669ce782349d39eb668e0d98ee92a'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_received_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3f3f6a7fd2f74c9f9419cd10dfd0c4b8'
                        key: {
                            document_key: '7a8f4a1d91f5400a98737d475a6e097c'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3f670a163379461b9b0764398dfd1c09'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'credit_cancelled'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3f6e2e9289354749a18028e743bc59ac'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            value: 'le5'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3fb3b2c0d018413189268d1703b84563'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3fc9a5f536a449bf8e4e2552916f8a7e'
                        key: {
                            document_key: 'f62b397ec62049bc967521992592cbba'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4023be7b877e4a51804c7c62b150da44'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reviewed_on'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4048ba38125442dead6dd9db0510c73f'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_requested_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '4069a36112c14d779923d423af6cf42c'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            caption: '登録審査'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '40ed5c49af834963ba2b3c0be2cdf573'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: '1985e0ceff2433008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '410ac8337012487397b7a4be6239c500'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_visibility_scope'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4111edbaf40842ae8f07ade54c59806f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_judged_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '41589569698a4435a2ca5c9958a92f59'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subsidy_rate'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '416ad1de76074b0bbeabc7fa0c1d98b3'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_end_date'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '420a2355a09b4fbaacdf978ddfbd8122'
                        key: {
                            document_key: '0da20af899b748eeb9607cc09a153e2a'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4214d688af104e00b7c6b4d45ebfedee'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'defect_fixing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4218c1f186cc41d6a91a3adcb66aef08'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '422bbd30f6b54b7ba39b1e6dd7e609b3'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'defect_requested'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '424626188a3540edb85538e24f2325c1'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_request'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '4250953136334864aec21bf0dfeb0d96'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4288dbc561f946ba8ac1f49d05dcddf5'
                        key: {
                            document_key: 'dc62853db94c471298a8e9fa195e8d9f'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '42d09a1fa1bf4c7582d5849357e29fff'
                        key: {
                            sys_security_acl: '9fd0a2c10ff6452c834925074b0c7567'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '431a13b5275a4fc1988c5a59c0ef0bda'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '433237d34bd945709dd1e25f31227f0b'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4334e37a2702411baf0bba708d8eb8ae'
                        key: {
                            document_key: 'd2d9260808764fd8bc848ad8c529fda7'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4347134f058944d5834f8dfd6c05934d'
                        key: {
                            document_key: 'dc62853db94c471298a8e9fa195e8d9f'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '435cd2f21afe45329875bf93d679d24d'
                        key: {
                            sys_security_acl: 'db7ae65f286f4c7b946bfc877a017e4c'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4379a5016a08481ea6672fc06c9cc7eb'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_assigned_to'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '43d6924859914ae5b56d738090747acf'
                        key: {
                            ui_action: '28599088303940be8dbbfb380235134b'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '443db4dbfe8a4ef0a568487a27612ff3'
                        key: {
                            sys_security_acl: '96f118ede420483a95686a6f6a0b5c2c'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '44548ec03fd041e5b84eaecae3ad4df2'
                        key: {
                            role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                            contains: {
                                id: '0e57309f0c9e483c813671970347786a'
                                key: {
                                    name: 'canvas_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '445f633e82ec429f8f14a491dd31b63c'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_organization_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4473757f99664bc5b48c0aa35f423d03'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'credit_judging'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '44933c62a740408c8f17e69d1ce14ac5'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_rate_denominator'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '44e7f27a985b4671a01497397a23529c'
                        key: {
                            sys_ui_action: '0976c4e239e643d48c90500b1a24911d'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '457b8927eaec42f3bae35c25b3033e7b'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_approved_on'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '45c8042385744676b6fc90cb9dc69964'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '45cf45b62df447a69efca2ffe0d918c5'
                        key: {
                            sys_security_acl: '1f1d21ae13df4beaa54a550c8adeb9a1'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '45da1cec7cc849259612e8cc0ec0855e'
                        key: {
                            sys_ui_action: '8661e15c4b7247659881f33b285915c6'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '46434c49ed8b4980be969acf65ae6505'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_priority'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4658c36572fd4b87b079122db025f874'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '06f9167b672249b3bf147025131b5b9f'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4667e223da1247d18cdb45070167b135'
                        key: {
                            document_key: 'ae335397fb1540b7ac958c128a54168f'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '46a9b94aafd54c42b91203717ef01028'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subsidy_amount'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '46b238ee45f241a396d4fc6e3079f793'
                        key: {
                            logical_table_name: 'x_dent2_dentsusoke_req_doc'
                            col_name_string: 'u_request'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '46bfaddeb7c847ff88edca0036df6596'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_application_status'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '47793935ffb9443f8210e3a5ffd17ac4'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '97c07d08d34a44458e8b625de855d82e'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '47a70cbdf9f943309954e7708029be90'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '47eb19a8128e409bae9ee556a89f72b0'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4871cbbc9b9a469ab5c152ed93c35289'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'registering'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '487231a8adbc42ac9b4b73f081dae61f'
                        key: {
                            sys_ui_action: '901abfce4da242a5ad1f70be89d2f28e'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '48970bb3c79b404b891dc4b821e4df3a'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '48ec30f7e600489a976e886aa4a6b027'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_requested_on'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '49283f074d98452da37539b5cd039b61'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_auth_method'
                        }
                    },
                    {
                        table: 'par_dashboard_canvas'
                        id: '4a0d4a2cf8b24cdba9bb8bbaddf81d96'
                        key: {
                            dashboard: '0ac41e438c0240e5889534fd7571fb44'
                            dashboard_tab: '5729c87736dc48b788178de77bb48251'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4ad2350503df4b3ab461840ae6c004e4'
                        key: {
                            document_key: '3ace2ab433fa4561bfdcbdf9ec406a3b'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4af9d03b8f714516a21d685bcf67ce08'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_start_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4b06d123de1149fbb783b54a680b902e'
                        key: {
                            document_key: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4b592d9912d24582b4106484a13d447a'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_notice'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4b8986841a7b40e1a0e0413a03a982dc'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'transportation'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4baf44e420a84fa7bc892fdab0245bc5'
                        key: {
                            sys_security_acl: '8c71484ca2344b76baca3103d06dec63'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4be81ce1101f4d93a89d7e975b98619d'
                        key: {
                            sys_security_acl: 'ee9e49ac907643df93278723f6d67238'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4c35ca5a180a4cb88ebeafe1c65c0c8e'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_created_by_applicant'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4c550d11de544d55b0089ddfa3e50d2b'
                        key: {
                            document_key: 'd4b6c57796b04c098cd5f9fb464c6957'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4c714649ff2e4cdfbf47aa4c2af57e69'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_award_number'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '4d41d609b1a54196a83916c87fc0f4da'
                        key: {
                            sys_ui_action: 'cefc34460a364958a14d7db48278c4ea'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4d4521e1996d4476be923c623e014a26'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4d4df50a3cac4a8ba7698d933044597b'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_sequence'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4d98214296be463490656ef553c39992'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_rate_numerator'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4e0123f097c44ff297a36cd9349d7125'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4e1b4a652e424b5b8f4b559770fd9443'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4e853c86befd437aa96e4cac4c5ac6ee'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: '3d0c7bd69fb8497c83d4352372cafaa4'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4ec743cd46cd41bca73e63894cf1ebcc'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '01de1fca560541748f357179c17bd032'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4eccd075407a477d95418f342d33ffcf'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'ext_preparing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '4ef74d69ead348a2923dd522f80b49ea'
                        key: {
                            ui_action: '969407a0aab34168813b190e3d7401c1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4ef8584a20a949dbbe10cd141e0a0b33'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_total_expense_amount'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4f040cbc882e41a5b7b57078751231a2'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: 'e8bcf8b1f14f42328096fe43135a2f41'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '4f36e96de0754d56941a523b84c14588'
                        key: {
                            sys_ui_form: {
                                id: '47a70cbdf9f943309954e7708029be90'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4f8e45f80eb4419dbc3ddb00dc6f3b58'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_read_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '4fd46ad0c6bb491eb19626384d64e3b0'
                        key: {
                            sys_ui_action: '973c554112154830917c6c470799e685'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4fd8bd985c5940fc9bb5511819527ab1'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '4fd9144f40834b899a3a80cbb12441a1'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '申請内容'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '506228cd6916429781990f7f7af7f416'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_occurred_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '507c0642f55c49fcb7db0fda8bcdffca'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_submitted_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5089bff8b41e4adf9f14405b2d43dc8e'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_registration_status'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '50bb4e588c6c44f7a6b8f98109f2773a'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_subsidy_rate'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '516909216f554a38be78365b0d85d2e5'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_daily_cap_amount'
                            position: '6'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '51805eba73834bcf83cebffaae5a6d25'
                        key: {
                            id: 'x_dent2_dentsusoke_register'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '5180cb0eb09d4556a742efa7f74a16f7'
                        key: {
                            sys_ui_action: '3e21d626f50042369e16119d2a5ba749'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '51cc3adf092049a9a804c013cce01088'
                        key: {
                            document_key: '4225340978364f9da32126893d274b77'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '51f1e0b1fd0e4ae8bcac824a0e3b4cd5'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_subsidy_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '523a00c8ef7942cab18926d287aa51ac'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_capital'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '523b47c59f944fb2a2a61b3b21dc62ab'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'aa2565fdcaa44b1d8bad614efc4f95a5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '52670c2d7a9741ff984c3721c52da36a'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_round'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '527ec9f184194aeb8cd3e735fb595e3e'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_application_number'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '53278d60010143fa845645c6bdc503f6'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'input'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5342a99321e24c208340bee7b356d088'
                        key: {
                            document_key: '7a8f4a1d91f5400a98737d475a6e097c'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5361051e16ea4466b09cb88ea4badac9'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '4dae486bffe04d9f8d51537a35d57dc7'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '53618448912d4286a9e653fd2aff3036'
                        key: {
                            document_key: 'de07742e5b3e44ada9012477f17b7109'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '5373d51eb382498bbc2e55096e8baeef'
                        deleted: true
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '626df8a7753a4f32a09811a88224476c'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '53856b8e124242d78e4be62563f2839c'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5397f02adefa4cc196b15f1be0421161'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            value: 'le100'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '539ba9a1af894ac0afc7222774037223'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_prior_year_awarded_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '53bbece526264b0e91ea78428636892b'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_review_result'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '53dc85dc29dd4b12824e60103b6044e1'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            id: '468c098695074b01b3b98da19fb0621e'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5403121889804a10bacdbe38a23cb8a2'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_created_by_applicant'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '54c99b41eb1e44ff8c5f13bc6d03f7ae'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_visibility_scope'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '54e5660997f34dabbf1701fd12e23344'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '552149032a764b35b67e2e768c75eda2'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_name'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '553207e934554d08b3a603e0943d1119'
                        key: {
                            document_key: '97f75e9464f74979b8e61e63c3347c33'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '557e7384febf4269a74ece2dee4f7227'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5580d656ca09486aaf52c42ceeded36e'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '4e638678b59b4cf98568a85120d23484'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '55b68de34c944ec887a106b3f7c29d49'
                        key: {
                            document_key: '9024bef0a6a344ada7cc3f6baf1bdede'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '55c8af4ce201424c8b2009a3dd01fda0'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_created_by_staff'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '55cf207a416b4d38b4944c8ee4607840'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_reply_body'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '55ecb27e95db4c5f8da72292eaefcf5c'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_entity_type'
                            value: 'sole_proprietor'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5607b20d187145d3b09ead75fbf36999'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            value: 'gt100'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '56b10470d33b4d87bac0cbd6385f2025'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'review_assigned'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '56e5727dcab8412ba20fc936edfe51a3'
                        key: {
                            document_key: '9162d4ad35b940f2a04e688a6064671d'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '57159891b04a422988555045ce6186bb'
                        key: {
                            ui_action: 'f69a62ebe3ed46498bbcdaa233d0bfd6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5769fc12ccb340f681eadeaca7546d70'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '576a3df82d3d4ccb8f1cff4c7c70b991'
                        key: {
                            document_key: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '578a6ef7a31342008bfbd05f06c00e42'
                        key: {
                            sys_ui_form: {
                                id: 'c8e46c4c1dea4d0bb8f07d0fc5760c81'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '578cd390228e435c8eb59632fd12877a'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_award_number_for_sync'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '57aeaf6addc94f1d9bf5ca4d8ca52715'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_agency'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5944634caa074c8ea735915dbf389dcf'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_replied_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5994b8135c4c4787be1bc4138eb496ea'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: '98c44875ffa033008d3f5d9ad53bf1fa'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '59be266c4d884a9eb5a8b7e00b52d1a2'
                        key: {
                            document_key: '7a8f4a1d91f5400a98737d475a6e097c'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5adf7e7c1a244e87a14b8e90f4b2d9a4'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_order'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '5aebaf5011b24359ad5eb39a4d4f5add'
                        key: {
                            sys_ui_form: {
                                id: 'eb8bf96fa6be49f8865f09a70dbd2f2b'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '5b28cb964b04421293d0f6c54b1ca5f3'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '5b88d4dfadf64f4181ecc465b9fc2522'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'bb9d37da4d9a4156b8950ca376cd6ca0'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '5bfb6f47d6744ffe94c77c0f5e09ea42'
                        key: {
                            logical_table_name: 'x_dent2_dentsusoke_read'
                            col_name_string: 'u_notice,u_applicant_user'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5c2dab52b6894712b65821564f8ae929'
                        key: {
                            sys_security_acl: '1faabcb7f9b54a778f11e0007dff5735'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5c875c20956249a8b7e7162662d8d217'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_note'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5d14c49f0ed44dc6a4428e38e4fea11b'
                        key: {
                            sys_security_acl: '3deff13c7cbe4c71ab18d6a959e869bb'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5d1662af9453406cadd47f93cc9a9703'
                        key: {
                            document_key: '3d0c7bd69fb8497c83d4352372cafaa4'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5d37c7c431c14ab9bd6a0341030ea473'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_business_entity'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5d49430da86d4a4bb1896d29f7b32e9a'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_result'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5d4c2f988b624e29ad496d136ff418bb'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_business_entity'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5da295b93e5346e797d7638290fa92c5'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_visible_to_applicant'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5ddb5433b2f04e8c9976aa4a650e1828'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_business_entity'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5e0691110c5c4353983a1d64ce233493'
                        key: {
                            document_key: 'f62b397ec62049bc967521992592cbba'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '5e6d097d330b4a2baa7721a93e1cafbe'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '81366ae4646a4aceb43cc43045f96e89'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5eacee0cc97c4c51b09a78064ce1aec1'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: 'b27b2b29ff6033008d3f5d9ad53bf164'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5ecb3b26a3304d4cafe3e68ea6c786e5'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_has_daily_cap'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5ef6472fc859420aa9555adea8c6bcda'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5ef9ecb94090484f8f0516566dcc198b'
                        key: {
                            sys_security_acl: 'a32fd19512234ab7a8cfc9d5808e5caf'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5f4d5941e56142a38a8ea13e92ece4ec'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_applicant_user'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5f4ed738aa014dc88311ba19d4c3f576'
                        key: {
                            document_key: '286505154e094dc98214ffdf6342b9d3'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5f5d9703452e42d8b85cdc6bc063c33c'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_order'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5f84df7ed0b24087bfc7a897a2f12515'
                        key: {
                            document_key: '5d0f6d8f09ee4ad4917d26c3ea17886e'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '5f958a2a01fa4fa89c72b3c4322bddee'
                        key: {
                            sys_ui_action: '901abfce4da242a5ad1f70be89d2f28e'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '5fd267c6826d4da4ba535302ddfb1049'
                        key: {
                            sys_ui_action: '03b3531cc65b4b12b055d5df8a35567e'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5fece13fd0d3406092fc6c9193ed4a65'
                        key: {
                            document_key: '3d0c7bd69fb8497c83d4352372cafaa4'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5ff42be06ff948be9c927b7a6323ddd4'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_issue_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '604319fa714e4376be816e662be53ad3'
                        key: {
                            document_key: '3afc11d62da2461f927dbe2351c8fa1f'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '60b1dbfafe444d0fb07bd05df2f5c5d0'
                        key: {
                            document_key: 'e8bcf8b1f14f42328096fe43135a2f41'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '60c599f674eb4a4187d5057d2f753a23'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            value: 'not_eligible'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '60d297b08c7a4690a39e4d38d937e46e'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6116069d93bf4905bb0370b24328ab57'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_to_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '61570f1fed104e099ab623c119cc12e0'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_decided_on'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '61816e04cd0349e189368a4ac1b8cf41'
                        key: {
                            sys_security_acl: 'af6d81f795974207aaa7edb7ade6ff60'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '61d264b9d0f04763b83a2884941e1f43'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '61d3a09a859543319a823df3ee7f585b'
                        key: {
                            sys_security_acl: 'c746446834a14a3d9ca245042be0e169'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '61f6c5c9bd1048b4a17830b1c8cf508a'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_code'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '622da96c55ad4e8b99387bf0ee3da0d7'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_approved_on'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '623fa6dae6cd497c8a1768a27c31809f'
                        key: {
                            ui_action: 'c04d355a69054f55b9392041a24800fa'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '628fad403f9145b5af5e9089d67bd84e'
                        key: {
                            document_key: '78f17fcceabc40bba114af1b20ec0e6a'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '62925639bd3441e9852dba62b07a24c1'
                        key: {
                            ui_action: '0976c4e239e643d48c90500b1a24911d'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '63114331d2e8465690891ee689f5dcc9'
                        key: {
                            document_key: '84c1ad1f66454764bac4d30ed6b4c392'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6367dd8b9fc141269f66235ad056ee6e'
                        key: {
                            sys_security_acl: 'b006c349bbe442c4b61ac08c4e324a10'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '63c5cc4582da43ec85abca2fce00fb38'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            id: '860cc68d64994b57a55e3b9bde02eed3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '63d11dd0e99c463fb556ac711c4c7290'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_number'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '64094411bd96464e8eb26c29fc8bc350'
                        key: {
                            document_key: 'ea3b16c7147546049da8cc32ffc23bc5'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '646422c95bab425a8617729e07583220'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6464ea2f145c47df8f8874cebce9d585'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_sales_increase_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '64c818d6800840eba76aabf7c5c0919b'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_expert_fee'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '64ee0db493fd4f16a8310236289fb8ca'
                        key: {
                            document_key: '3afc11d62da2461f927dbe2351c8fa1f'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '65885ec8deb24cab9d05d09375793573'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_result'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '65cc7eed9a354593b6b3a093449f3bd1'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            value: 'sole_proprietor'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '662cc6cade354766848e2a6a61dd4484'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '663ab6fc9a774be0b6fe7ed9ed06371c'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'e67bb497042b456aa20f8cc24c672fc1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '663b6cec9414493997a7a8faf961d00d'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_result'
                            value: 'ok'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '6667b60ab4c74ab08230090c4c1976f4'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            id: '97f75e9464f74979b8e61e63c3347c33'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '669691d1267a4c978779ad92da954f03'
                        key: {
                            document_key: '2aa2a114e27b47a29251bedf507a3034'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '66d15a7c8aaa4d81bdba7a6ba9e883aa'
                        key: {
                            document_key: 'eb8860d62f6746668ac30d01dae0f943'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '6705ef9d7d344251b1237d3c04be3f7d'
                        key: {
                            id: 'x_dent2_dentsusoke_apply_exp'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '67079fe31a5c4eb89af3e588bc2c031f'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '33c713686aeb4f1084b670e990970a83'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '672dcbd15fa94ff6923eaecc58b110c7'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_judged_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '6763f39bf7224346bd856c4a4f8aea08'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            caption: '問合せ'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '6768f15befef4f33a3653f5cd34c57fc'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            caption: '対象経費区分'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '676de867682c498ab42b58bdb4453b63'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '67cd97fb97cb4d0280af9e0927d1a22b'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '68204159ad274d43864e517e2107a1ef'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_applicant_user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '682aa2300fbf44bbba394df4b7298cec'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_subject'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6845d0fcb6f6447380468e0874f149ac'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_description'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6856901567de4b0e82ecf7420368f751'
                        key: {
                            document_key: 'f09c19c4230e444da6ac926d7036a20c'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '68cff073030e4e8e81ec82076d4fb366'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_withdrawal_flag'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '68fcf8a1db544d54b1913cf17cdbf452'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'ea3b16c7147546049da8cc32ffc23bc5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '692cfe515c1f4b118bed4179e6369cbf'
                        key: {
                            document_key: '468c098695074b01b3b98da19fb0621e'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '696e54530d6540b3843da7dd5fbc48e1'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_assigned_staff'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '69754bdd89384bcea08da8b2b94275a5'
                        key: {
                            document_key: '97c07d08d34a44458e8b625de855d82e'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '69a4f79e8cb04dfaaa6990dd31154a2f'
                        key: {
                            document_key: '93b476b1492d41d388bfbd7788af75c9'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '69c51340b3174ddab83edbbc85657f26'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_rate_denominator'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '69cbda52b0ba4e02be5865c354be2c7b'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_defect_reply'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6a377ccba5c640debcda3a80093a9fc0'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_code'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6a77a8da9b0540558c317ff075b93aed'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'user_name'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6a7ebfbf65ed49f788f41161053bc432'
                        key: {
                            document_key: '4225340978364f9da32126893d274b77'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6ae24e3102d34a4b8a90c4510d98d6dc'
                        key: {
                            document_key: 'bd11a71c166b4645bd312b494d53de27'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6b7536fba67e4a6d81ee9de2ece8aaff'
                        key: {
                            sys_security_acl: '9886ff7f56b54ddd82f962d4a7f461f6'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6bcfef6f7f9c423c9cdd0ce1a717cce7'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_result'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6c071a0daf454b509dcd56a282a25c92'
                        key: {
                            document_key: 'd4b6c57796b04c098cd5f9fb464c6957'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6c6defbbf33c495c9dd0a0b6bacb73d4'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '6c7c238ef6514b08b8b086c03c82b72b'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6cf40099efd84ba788d250b06d542491'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_description'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6d466856e01b48cca55fbe1c8052cf07'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_email_notify_flag'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6d7a08b5832a4ef1851ef32a998afd7e'
                        key: {
                            document_key: '81366ae4646a4aceb43cc43045f96e89'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6ddcb92fa6704a86a5fdeb7b54ea89e7'
                        deleted: true
                        key: {
                            document_key: 'd3e3ab4ff03442a88ec01a1991ee124d'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6ddef13b40924e59917cc7e8a54be6a4'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reviewed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6de1683c2dba46f099c0d9596a39d839'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e02e10d0cd6442593497d7da248924e'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e94b55fa4a446fbb3859974a7e9724d'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_award_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6eb0d2eab23141ac858ab5d909519f2a'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '6edce85020d14176bf1053c8d99c1900'
                        key: {
                            sys_ui_action: '0fd298ec5f1d46b19f6ac86f05d0a665'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6ef758de286944078694a254404e72f5'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6f0726025eda4419a69285991d0e8815'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_active'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6f0f3ee7ec564639a741084476465dd1'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_code'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6f1f34d6d1fb4107aab0e1b9b3dce787'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            value: 'quotation'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6f251e4405914146a48dfc248ef11d4b'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6f321f6c0c8042038ae0e0362794ea74'
                        key: {
                            document_key: 'f09c19c4230e444da6ac926d7036a20c'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '6f45f1e5463942f99daa67f65b53165d'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '93b476b1492d41d388bfbd7788af75c9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6f7dd7d988fa4a11858a61e45c2bbb72'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_approved_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6faea25079694092a707cbfceff50323'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6fe96c978f804943ab214e38943a2d46'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_special_measure_flag'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6fec380ea5404ca29f8d699ef5059a16'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_priority'
                            value: 'high'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '702fb1f2d47847ee84e4ea7bdc8f3ebf'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '707b5238d3fa4360bcfe17280f56c79e'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '709cdca5c1b149caa61b451860dea7b2'
                        key: {
                            sys_security_acl: 'eaf3c900849841cfa80acd77d1c42b76'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '70b1266012ea4def9f56a62c10424b57'
                        deleted: true
                        key: {
                            document_key: '626df8a7753a4f32a09811a88224476c'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '70c8cce15fa04fe88e66450690c7861f'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_employee_count_category'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '70dbd9c6f1874119b70290eac8fd228a'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_title'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '714705c5dce3493c9345c7194a0d21a1'
                        key: {
                            logical_table_name: 'x_dent2_dentsusoke_credit'
                            col_name_string: 'u_request'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '71517838fe98460d88e818ea213d8402'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '15'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '71b44de5206d43639e977789d8ff1b38'
                        key: {
                            document_key: '5b446558b2094756bb9666a5292e05f5'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '71d1b1a223424de39a2ee85d78de3efe'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '71deda3d6e204698929b986a0a162075'
                        key: {
                            ui_action: 'a9968150bbf94a9e85ec8fde7a080e4b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '71f0eda9df234e63bda5972ca90936ce'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'review_started'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7218bd999a2046d9bf5a8785e4eef83e'
                        key: {
                            document_key: '3ad79e075f20447c81d848de27c495de'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '721a9cbe285c4ef4bc580b7a99c165a7'
                        key: {
                            sys_security_acl: 'e7dc3474deed4dbaa4051afdc116b05d'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '725f42f073f54c8397983e1ecb27d0c6'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '9162d4ad35b940f2a04e688a6064671d'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '72c265b66d4c4e35b7a8c0fd463c2695'
                        key: {
                            document_key: '33c713686aeb4f1084b670e990970a83'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '72c2de831c2943e4b00ddaafab1af719'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'review_passed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '72cb3f1ad01b40ab8983d08383ab7226'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_capital_limit'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '733b60d78baf4a9c870bb630b40240e6'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_special_measure_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '73b6aaca92234fb4a18edbab0f19378f'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7430c05522c94ab68cc3a8f9cae4394c'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '749ddb50b3f748d3a95a74303a35b3ea'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            value: 'le20'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '74e65d6393d348e393779ec538c36728'
                        key: {
                            ui_action: '08efccdbea1e48c2940ed36342e55f91'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '752470de559b4818b3c3142cfbe1eebf'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '75c95782322e4778976766652215d4a9'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_submitted_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '75d6b3d538044249bad72d85bb7c3a66'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'credit_requested'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '75e4cede64634da3b8135bbc81f630f0'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '766c0b889a9b46b599a898b419c4c1df'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_capital_limit'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7691a03d4f1c475f8be2f385ca9f327f'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '76969e8ad4b245deb19f365afa9a581f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '76b60936f2934c9ca0f5c0c6585cfd26'
                        key: {
                            document_key: '0014f5c3485f4020994c15aa1d44852c'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '76da102f072d4ff4a79dbf338af0b098'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '76f8c6ab59be41e7b73abc06880bfb20'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_code'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7709b42e7b50430098dd371225eef800'
                        key: {
                            sys_ui_section: {
                                id: 'd65b71a023394995aa0110967d3ea132'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '778ad29635124a5781f013da05528597'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_status'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '77c66b5ff0114ebab8faad3b0c596553'
                        key: {
                            document_key: '0014f5c3485f4020994c15aa1d44852c'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '77ce068ec0574e4c8f6deb8dcc832165'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '77e2e1166fab48c693f33ed53b79c06d'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '78287e3e56ec47fc80d2306cf743a7a7'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '7832703c75cd4a83a96d6671288695c4'
                        deleted: true
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '6a4cd1cc1fdc435a9e75583729df47aa'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '78c0e49e9edf4adba5cf11918509584c'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_prior_year_awarded_flag'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '78c17906a8534abdb68f44c9cf93262d'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_subject'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '7904e07c030d49dfbe7dfe140a9ecb10'
                        key: {
                            id: 'x_dent2_dentsusoke_apply_doc'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '797043065b424a58bc81f71773758570'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            value: 'sole_proprietor'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '797bcbec8d4f4d89b9189f4c58e0dc25'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_withdrawal_flag'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '79a9f0f8b3ca4369b8062146caeb7e22'
                        key: {
                            document_key: 'e67bb497042b456aa20f8cc24c672fc1'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '79aaf08591834502b081c15dcd22984f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7a0bd4dd30e04ad8a07fb605a401f1a9'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_fix_token'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7a5e563018944d1086921d108ed61d49'
                        key: {
                            sys_security_acl: '6b9d7038bae74870ba62eff4a7a960f6'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7a8e5fa6f8ea446cb8a953eb84e1c2b7'
                        key: {
                            document_key: 'aa2565fdcaa44b1d8bad614efc4f95a5'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '7ac41057f81d4098b4c9586e25b00423'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            id: '4225340978364f9da32126893d274b77'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7b350ca3e79f476e845257dfbe5d3895'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            value: 'credit'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7b3dee5f738c412193243944cf97b078'
                        key: {
                            sys_security_acl: 'c0e33f36448344718e635185e999ad27'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7b91c55de77c46978ff457286c19b0ad'
                        key: {
                            sys_security_acl: '759c7abaa4834692b77b4e556b45adce'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7bb503f4fd574dfc9467c58e8e866d02'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7bd9bb3269fb484e9455bc9b7056bcdf'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_days'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7c0a731357a54e95a425cb4c3a959131'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_rate_note'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7c33119a2dcc465fbe151cb56f20961c'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '86a125ef64114f51846bc469ca95bcbb'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7c3da7bd3149427d9c4ca4e6fa23b4a9'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_expert_fee'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7c6a613e185742baa0c98c96c7eba6bc'
                        key: {
                            document_key: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7cb82b7b545a438abece7b7ae892dce1'
                        key: {
                            sys_security_acl: '576ba778ad66423fa6232e0d7735549e'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7cc221ad3e4048d7b1d812db7234b85d'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_received_on'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7d2045fba3b443f7b90c6370b6594fa3'
                        key: {
                            document_key: '97f75e9464f74979b8e61e63c3347c33'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7d317ce52eb74992adc2090685ba6ecd'
                        key: {
                            sys_security_acl: 'd5cc6f0d525141c4b021030f25fe7d2f'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7d6d72d1e34a4db8aa8ab8db0e439a1c'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reviewed_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7ddfb8250bfd4bcbb5047c6a017be982'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_detail'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '7e47c7027e664b62ac212258dc61570e'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7e7396c26eb7446e8ed8720eec37c0b7'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'defect_answered'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7f2da982e39743b38f1b8cc2aa4a220e'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            value: 'registry'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7f8ffbbb2daa4ac8b56670da4de442d0'
                        key: {
                            document_key: '39a8791f9c0d4c68811e3a35ed0e0548'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7ffec24603334384bdf496b18daf60c7'
                        key: {
                            document_key: 'f62b397ec62049bc967521992592cbba'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '800c4d057b0143efaed1acb531282198'
                        key: {
                            document_key: 'de07742e5b3e44ada9012477f17b7109'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '801151b6849944478e048f923046ddac'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'registered'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '803bca83d5ce44d590b02bd928de67c9'
                        key: {
                            document_key: '1bcd0bd10f2e4a939fa40be282af67bd'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '80a7477ecfac457882f4d64ed83c9b98'
                        deleted: true
                        key: {
                            document_key: '6a4cd1cc1fdc435a9e75583729df47aa'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '81ab7fae8d44478db388282870c22719'
                        key: {
                            sys_security_acl: 'b006c349bbe442c4b61ac08c4e324a10'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '81ab872c55a349a9a00b9009d6b081f4'
                        key: {
                            document_key: 'ea3b16c7147546049da8cc32ffc23bc5'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '81b8946d041e476b848dad1ffd3fcf75'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '81ec9466526d498baeb2eaa5c4c1cb34'
                        key: {
                            document_key: 'b2d316a958524399a15fa5c71ebc5626'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '82021674acc94d2fb9f9f1eb335da813'
                        key: {
                            document_key: 'c59d061bfec74c508aa18a171a37a849'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '82286e12173940dfab91eafb85cd1283'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_auth_method'
                            value: 'standard'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '824281782d6a48b981474a510045c496'
                        key: {
                            sys_security_acl: 'd143cd4b2fa94bba9177e5343047389b'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '829bbcea6d64423da837a598a91d1650'
                        key: {
                            sys_security_acl: 'f16456ba60dd46dda71d2387fed0718b'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '83b69782cadf4bf6b3f0a1ca10b84e51'
                        key: {
                            document_key: '06c68f9cad6d4358981bbb7c80caceb4'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '83d510cfd50e4b8086ea0ff84c2e57b5'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '83ee1d6b68e14aa48c9aa8f3885b8ac5'
                        key: {
                            sys_security_acl: 'ee4b8facf9ae4d73907a4eb38a734784'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '83fb44b7b273494b84c98bf03fffcd28'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '841d4c9bb5b4430a8b7a8e343fdad09b'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_user_type'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '845375870bb9463d993354b4ea63e60d'
                        key: {
                            id: 'x_dent2_dentsusoke_apps'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '84c15b7f18f446ddbb1edeffe73a88d9'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'ae335397fb1540b7ac958c128a54168f'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '84ebf01951cf435eaab9f396632a29ba'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '8516abf913c64b34ab2db3eb3d51a785'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '859b52baef7c413aa84569b850390718'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_occurred_on'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '859e46f680c5467bb9977d2619c43d42'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_rate_denominator'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '85b57af53a5a4a58a807834fb23432af'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_order'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '86321e90c2024895bf8e342bfb72b3f8'
                        key: {
                            document_key: '84c1ad1f66454764bac4d30ed6b4c392'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '86673ddaaa334439b80d3ca13670e4be'
                        key: {
                            sys_ui_action: '0fd298ec5f1d46b19f6ac86f05d0a665'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8681a3cac68b4bd1bad1c30741cf4d6a'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_fix_expires_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8688a612f5484475b47585499e53a8a4'
                        key: {
                            document_key: '0ce38091504a47e3b6886ab7376424b5'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '86975eeb63b44139baa620e31733f557'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '86c4e5a6851e4532809f8b745c757779'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_requested_on'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '86eb8fec72b34185ad0498c4df4c21ab'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_issue_note'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '86f4f8b7ea71496ba2d1ebf6431a0493'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'eb8860d62f6746668ac30d01dae0f943'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8701d10b3abe46c5939dd75ef3bee547'
                        key: {
                            sys_security_acl: 'fbb95cefbb2d4535a507901cd36ba2f4'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87166918b05d449e86e800b30d448937'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8731442eec0c45ae98b8f58e00900978'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '87444145361f4d9aa1624bffca598534'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_end_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8787732c189f4b979fdef58a0bf6675f'
                        key: {
                            sys_security_acl: '7cc7d1c6f01e401ca17eb97036b8f8b3'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '879fe4caf4e04d0698664903fa6e2da6'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: 'd4b6c57796b04c098cd5f9fb464c6957'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '87ad0fcbf7784ed5aea6c2a61007e96a'
                        key: {
                            sys_security_acl: 'f62cd4ba4b804886bcd4a5590645eb6a'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '87b6b32220784baf85396f7e51207916'
                        key: {
                            sys_ui_action: 'a9968150bbf94a9e85ec8fde7a080e4b'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '87d1bc6bf29a40d1b2ae47492ce61d71'
                        key: {
                            sys_security_acl: '67b171d2ed194359a917a6eee034b002'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '87d54ce0ee064672b209eea8dff7785d'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '87ef50217d794655a6c946e506352dcd'
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reject_reason'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '88493a44c6c34f788827cadf11b25b8a'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: 'b2d316a958524399a15fa5c71ebc5626'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '887172ac58a6428c851188eea0bfc057'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_note'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '88f6325d71fd4659877bf3c093515299'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8962a670c5a24e3ea0a20d98b3c0e950'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_amount'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '89709d505bba407da3959ff66f1742e1'
                        key: {
                            sys_ui_action: 'c04d355a69054f55b9392041a24800fa'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '898e43957cad4ccd958c867b5709d0ce'
                        key: {
                            sys_security_acl: '43f368e8c56942eaaed78843f7190dfd'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8a268a31ac234bba8c2880f0a674ed86'
                        key: {
                            document_key: '3afc11d62da2461f927dbe2351c8fa1f'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8a34059d86044a94a4bd83602ed30d30'
                        key: {
                            document_key: 'a1c041af46e6490580c6fa076b4f233f'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8a3a28d3d35d449f84bfddb71de272fa'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            value: 'le20'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8a575805b1514389ac4040f05977afda'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_note'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8b5eabdb2f084b648c0e30ebcab87b64'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_applicant_user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8ba9ff10d3d345219b83bbf23d17904c'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_organization_type'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8c276f78e18844ffaf7401e64969b895'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_user_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '8c36ba1895ab4a4686ee9c58f054d9e4'
                        key: {
                            sys_ui_action: '3055b9d890a64fbc910da08e3ff36088'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8c984c43c3104eb3bb2266d4ea161944'
                        key: {
                            document_key: '2aa2a114e27b47a29251bedf507a3034'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8d495acc86e64bc0bfba781c0afd6e6a'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_address'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8d8adb8424c7456aa83bdf1ae1ce0321'
                        key: {
                            sys_security_acl: '96646844e4074f1aa10862790d3ae42b'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8daad13a302840058f37708dee13a549'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                            value: 'preparing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8db2ebcb884b4a298a947e7aa55c3ed7'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8e0d9931fb8c4276b296ee25794fbd5a'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8e13692f654b42079b0c89076a60ac86'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_request'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8e3763709ca64cd1a7f87fef30ef387d'
                        key: {
                            document_key: 'dc62853db94c471298a8e9fa195e8d9f'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8e5500d32f5f4884b3b6625744360d21'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_organization_type'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '8eb1fe3c15884bfcbf66cf602120e3a5'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'd2c22318dbc14f73a7f78dd79d792ce5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8ee0644083f84fd98a28b77cf3e1b8b0'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reviewed_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8fcff13cc2a04a73a9615b53663c350f'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8fdf9344d68e4a5387c01d8305f26a44'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8ff31bb357b44ecfa989988fef174c26'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'defect_request'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '90318a3b594e4d1fa200510ea514ca67'
                        key: {
                            document_key: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '908262d148c44e9ead2d38356ef6ede2'
                        key: {
                            document_key: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '90c73e5cdbe04bf4a911c0de3231e2ca'
                        key: {
                            document_key: '80b84451e9544c1aae7c3276410bf9eb'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '90dc825feb1047948d7e7587ba9913fe'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_body'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '90fb7ab9a8814538bcf3cea1a5979829'
                        key: {
                            sys_security_acl: '7b601a06dd2048abb237299916da0926'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9100266fbf59420f99ce11a3cd4f8b51'
                        key: {
                            sys_security_acl: 'cd6b2c33f025451baf464bceb3746b0e'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9136bddb5fb845178deb4f33a5259869'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '913e19a133be4861865bbc826a278a79'
                        key: {
                            document_key: 'd4b6c57796b04c098cd5f9fb464c6957'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '91622b4bad1343a4ac95e711d62cf1db'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_duplicate_check_result'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9194361b7c444c9789c1f27a44ed3ee7'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_result'
                            value: 'defect'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '91b93fd1c7ba4bd294062f47f6c87e0f'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '91bf985acfad4fd785db7608d622a93b'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'active'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '91d757c5b618462bb7db5e6fd5428920'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9210073b57774f078ae6170f8a42abae'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_reply_body'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '9248e3503ee442b78432e7cda60f841e'
                        key: {
                            name: 'x_dent2_dentsusoke.applicant'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9272b316acfd4b61bcc02a138fe0db2e'
                        deleted: true
                        key: {
                            document_key: '626df8a7753a4f32a09811a88224476c'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '92ac065ae1f84d008eeaf086e964329b'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '92f1f78fa0d34200a148b90cff14a8ca'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'result_waiting'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '92f38f9195494ab3ace84b227a3e0bee'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_note'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '93646dee62eb462eb0ea1e9821847453'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_organization_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '93971529e27d4e1da03e9efa7dc5d83c'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_visibility_scope'
                            value: 'sole_proprietor'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '93f7b6c594c4456ab95e2389bc9a9f6c'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_requested_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '94006bfd9b9041b3b4730937b9451752'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_business_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '944a5d4d7e5249f685fa0832177f2f77'
                        key: {
                            id: 'x_dent2_dentsusoke_mypage'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '948c89eb3eee48359bc66f0065bc8553'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_decided_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '94aa6c02ec404f1fb70b7634cc7ff7e7'
                        key: {
                            document_key: 'b0995324f3a24479acff4831b869379f'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '95553492d27b4545b0715558f4a887d4'
                        key: {
                            ui_action: '1d52bee233404a4a9402093a85a54341'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '955cf722e6c7443da497bf6c2cd8c9f0'
                        key: {
                            sys_security_acl: 'af6d81f795974207aaa7edb7ade6ff60'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '95778902fdd64460b0f71245690fea0b'
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_defect_due_on'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '959fc36661f24963b1c3f06a5db7336d'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_password_reset_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '95ab07720da04cd4a5437f74b4efe185'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '483dcc4284e44e148fb4b601334e2053'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '96700f39b1eb4526b9bc67600ab00139'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_rate_numerator'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9682080db84b468e9a08c256ae9e3aed'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'returned'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '96e16274f5f74f37a61d63221d415757'
                        key: {
                            document_key: '01de1fca560541748f357179c17bd032'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '971c342511704b21a20ef09a897bd54d'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_body'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9775c7c2b5f54f1f950de06a4bbf3ac0'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'ec6d8b200a7f460893aa3319a148e98d'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '979337d3179d4b9cbcb33e02e0840d29'
                        key: {
                            sys_ui_form: {
                                id: '431a13b5275a4fc1988c5a59c0ef0bda'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '97941b5078d842c68a5b10a181be3711'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '979f7c958e8d453fae70ce066006462e'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '97affca44a154423a3ee6fda983a66b9'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '981d7703f53b4552b217e0d4295bb5f3'
                        key: {
                            document_key: '06f9167b672249b3bf147025131b5b9f'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9830290347934a02a8721ab9bb4fed5d'
                        key: {
                            document_key: 'd2d9260808764fd8bc848ad8c529fda7'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '984930614b4d4f728d985022853a24a8'
                        key: {
                            document_key: '4225340978364f9da32126893d274b77'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '98756f926616482ab9c03897ac54c13b'
                        key: {
                            document_key: 'dc62853db94c471298a8e9fa195e8d9f'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9895ab19f75045c5ae5e6670fd223a27'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_token'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '98c8b559877345a890f5ec0ed3a697dc'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 're_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '98f9e0f00712426cadf86022b266a499'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_review_note'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '992f97ce866c4e2db65f9a3d41416c2a'
                        deleted: true
                        key: {
                            document_key: 'd3e3ab4ff03442a88ec01a1991ee124d'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '995c203fa78b4a08838cc54cb2e1aeda'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '997f1f4e77cc498a9c756400084313ab'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '99932c5fa6e646ae939403a6d5e95ca3'
                        key: {
                            ui_action: 'cefc34460a364958a14d7db48278c4ea'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '99cbb4f7c5d3420f951b2c28ebae8789'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_decided_by'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '99d2a22618634782ac1a268527064022'
                        key: {
                            ui_action: '0fd298ec5f1d46b19f6ac86f05d0a665'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '99e2ce663b4c4964adcc1160b330dc2e'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '9a0c86fae0914587a448281c562cee39'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '採択判定'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9a31cae605584f3da292270a1d74a9d4'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'unregistered'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9a3de51c4cb749e3b8c62f91f3515eec'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_due_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '9a86c5dd903440c9ad19bfcd859845c3'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '5b446558b2094756bb9666a5292e05f5'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '9af77c86f26b41259c585d9aaa5f40a4'
                        key: {
                            name: 'x_dent2_dentsusoke.staff'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9b5b72b27ec941238c223751fbb3831e'
                        key: {
                            sys_security_acl: '87a20ebac4f043aebdb88649ad20f773'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9ba5c93ce9514dda9402065c98482eb5'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_received_on'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9bb1c168c8f84981a1d68b5fe4b1f35c'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9bb93d8c3579477dbdd30a611323a450'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9bcdf965692541649f3e793f9b32a14e'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '9bf231d9a9cd49648fc21f99de87ba09'
                        key: {
                            sys_ui_form: {
                                id: '92ac065ae1f84d008eeaf086e964329b'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9c5329cb09f141939c390293b58e6075'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_result'
                            value: 'conditional'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c6fb8385c324a338cb31c956e2a3ced'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_name'
                        }
                    },
                    {
                        table: 'par_dashboard_visibility'
                        id: '9c84c143cceb4d26a6b2185a07090354'
                        key: {
                            dashboard: '0ac41e438c0240e5889534fd7571fb44'
                            experience: '9bb6e0517b5842ab9591753b7a87b810'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9cbd75b0220c402a9f88d00da49e078b'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_sso_external_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9cc72b281a68470babd851dc7e8d3915'
                        key: {
                            document_key: '84c1ad1f66454764bac4d30ed6b4c392'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9ce1d6551a254fd3903042081035a8a5'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_reply'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9cf5e2c07ea843ffb97ca9c6c1b228ae'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_employee_limit'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9d162fdfb02c41108b7bf91af62f0484'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'defect_fixing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9d5c65d6fd844b468a04ad67a08c882d'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_fix_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9d8310831e9c420eb2fcbfcdec60027c'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_business_entity'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9d84ab4a3b504249bccc40cbf2f8b2fe'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_active'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9d9b0760bcc543c48a41108c8eb6e2c3'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9db2e926ee964ae9a6d7885e2dc120b5'
                        key: {
                            sys_security_acl: 'b7fb5f02e76a46abb9ce633c09ad8b10'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9e530fb9c8994a22ad89fbd52ac782da'
                        key: {
                            sys_security_acl: 'fe82db3a92694c83a0ae8aa7bd85251f'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9e90fd67a49f440b8bef98538e542b06'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '9eedd50afdb845d29c316f93562dc1ee'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9f37f953221246ce914fc25686498008'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_status'
                            value: 'published'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9f696d16fe9841e7ac789b55437abed0'
                        key: {
                            document_key: '41b003f7efe648ac934adaef5970bd82'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9f6c897aafa54908a688a8cbdff43968'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                            value: 'no_duplicate'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a09f839179c04f14843f78dbe1e08228'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a0b125bc6bea4398bdc09fbe0b1497a2'
                        key: {
                            document_key: '468c098695074b01b3b98da19fb0621e'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a0efe35e4299437f9c5aaab1268e7e14'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_required'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a13acba6efd641c88449b1171728efc0'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_award_amount'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'a1486c173ce544c69858ed76a1144867'
                        key: {
                            sys_ui_action: '3e21d626f50042369e16119d2a5ba749'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'a1f1ad7cad08482888bb976447e59451'
                        key: {
                            sys_ui_action: '0ccdabf278f4415ca6526e33f3561eed'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a1ff7d3b29a44996b4f7ab5fdb327245'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'submitted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a20cc16d4e404bf5a7a750c906f87a7f'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a22eb4509f454d99bccf2e3c7b41fede'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_review_assigned_to'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a24fbe9bce2946c58ee4960d134a0792'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_reply'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a27b0a7c1a8a4d17a96e76b4aa2d2450'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_employee_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a2a0eb78e03e405ba7e4551bc46b4d40'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_result'
                            value: 'passed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a33c668c96994536a7e8a227ec905b3f'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_submitted'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a394184e79b34e6fac67cbd0fecced22'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a3ee8ede3b184a5bbd278c661fdf26cf'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            value: 'le5'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a449d1ee9cc8400eb6e8ef149d85d127'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_to_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a49f491077fb4c8980aed5ace88dd171'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_due_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4bc381db4274a99a813373392e64345'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a4f5551d2edf4d61adc638503100080a'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_employee_count_category'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a52f20080be945c3ac3ac05e0de55275'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_read_flag'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a590a59dc3f04e0c8514dbbf6517069f'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a5afaf0248804f5285c04ff94f51cf8e'
                        key: {
                            document_key: '0da20af899b748eeb9607cc09a153e2a'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a5b8d27c9e2948c592d570158d22fb9c'
                        key: {
                            sys_security_acl: '00b36fb9a8e14e07a3b36b2d06a2c355'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a5e4643ba35b46a297e2efa7d3cec677'
                        key: {
                            document_key: '1bcd0bd10f2e4a939fa40be282af67bd'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a5faf32dc95b4b419a2de1f995718fb0'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_name'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a65645dcb9454cda9d940ec7ad29afe4'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a66d6022af9d4c4d947c1790c4c289b6'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_special_measure_flag'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'a710fe79048c430b91c03ca1ad424651'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a786eb4abb9448fa9238da8e6bcaa760'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a7ace794c62d43f2a9fbdd12b38c34e0'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_updated_by_staff'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a7d33df1136d40fdb6615a6a6a4df333'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_award_amount'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'a8cdad85138f49b7a90152f8374e5af1'
                        key: {
                            sys_ui_action: 'b5456289ce59435b82d242a2f8d65f08'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a8e871a7f3fd403eb7c5f152240a5f0d'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                            value: 'duplicate_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a93d6a23c72d4d67840d55113fbb1247'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_organization_type'
                            value: 'corporate'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a97589ef611b4cb9ae47fe42d123bcc1'
                        key: {
                            document_key: 'bd11a71c166b4645bd312b494d53de27'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a983a71270b44e64a2705c7a86af4283'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_publish_start_date'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a9f1a9744b5141c48bc960bb3b9b5df8'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aa656a75dea348e6b66198f71c20713a'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_sales_increase_rate'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'aa66bfb244334fa09d8e93c29c0bc436'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aa70d9c7a0374e6692867b01fadde082'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_employee_limit'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'aa82f0eda4fc4f1abf13276b62251858'
                        key: {
                            sys_security_acl: 'ee9e49ac907643df93278723f6d67238'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'ab486d9d04b84e9e9bef8948ee5233a1'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'abb10c95a2e4487da620bb2745483fb0'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ac240ae7f7bf40a1a0406278d1e8df2b'
                        key: {
                            sys_ui_section: {
                                id: 'd65b71a023394995aa0110967d3ea132'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_credit_required'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ac6f9161199d4789a972bd03d504aa3a'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ac9d9f00d58e40b6bc2beaad84c7397e'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_business_entity'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'acd162e31a81404cad7bb4d536b319d7'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ace1f7cf5c3d4c4bb4e94cee332c7beb'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_file_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'adaea08444634bdfb1c4b23593889ab7'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_sales_increase_target_month'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ae5a2bdca83a4e5e80454373a95a6dfc'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_code'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ae618aa8fc284ffa98155702ade1ee69'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_rate_note'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ae61c10ce05c442f9c2fadd9ca650002'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_publish_end_date'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ae7730ad461e4ce1b4bfea13e547721c'
                        key: {
                            sys_security_acl: '550917dc0a6e4bcf863df0e811a26127'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ae9d594969244f95b7353a7d15494afc'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'aee63a3221e24513b531e50291230c4a'
                        key: {
                            document_key: '78f17fcceabc40bba114af1b20ec0e6a'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'af3d6325fa404c2ebba5d74f3d802966'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'af4bc0a6b52d4c99ba7cd00501d8f3c7'
                        key: {
                            sys_ui_action: 'f69a62ebe3ed46498bbcdaa233d0bfd6'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'af9a0460090e4eeda3d244d4a4e86638'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'afc15c73aaaf4316902c3e5fcae14f53'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_auth_method'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'afd0eeea597a4d788eb0282eb7df87d7'
                        key: {
                            ui_action: '3055b9d890a64fbc910da08e3ff36088'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b011c056683d40f2b6d96fafbad68d2b'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b01dbd64a9ef4db3bb36c50d66ab0874'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            value: 'le100'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'b043af6f581a453dbe17f441bd6453fc'
                        key: {
                            sys_ui_form: {
                                id: '47a70cbdf9f943309954e7708029be90'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b064cb0176694c849f8026f4d934e028'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_cap_amount'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b0a60a9333d54755ae1a4953008907f4'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_publish_status'
                            position: '5'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'b0e643829c8f47f193acb01792cc583a'
                        key: {
                            id: 'x_dent2_dentsusoke_notices'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b0f42437785f489d817a2dc97eef3f4e'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_decision_note'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b10cbd9b73654da0bb9260fcaef70c50'
                        key: {
                            sys_security_acl: 'ce036c479afd4e958fda273a7e8e0195'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b10d264cd0764a0db6c0df435aa33b91'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_cap_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b1254e2813164748b83c6366172165de'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b1475fcbd3c7463ca5da59e40c78c813'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b164935b539e41e7bc472a4a182e92de'
                        key: {
                            document_key: 'e36972df96764f29ba18d37e867fc4ac'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b176e3f268ec49e6a7d9d3ad5e498953'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_assigned_staff'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b183e723c9a34fe28ef167b367c3aaff'
                        key: {
                            sys_security_acl: 'a4010fafdf6243838ba41092da53039f'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b1b6f22ea5c84192a2c6d0c194171ecd'
                        key: {
                            document_key: '468c098695074b01b3b98da19fb0621e'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                        key: {
                            name: 'x_dent2_dentsusoke.staff_admin'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b1dde19bca104033a8d5163ee78cf182'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '2dead47ec4b24376852fab836bed3592'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b21214584eb5477eb37791eaebba16f5'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_approved_expense_amount'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'b3101824f4284674b10b1a5a88ad6362'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b325f22d8b504193a7c8e2ee68baf598'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'awarded'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b3e8ebb65a7445d196e7dbbf897fa6a2'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_result'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b3ea5ebdf6294e6d9d6949fe1f84155d'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_order'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b42b057941ce4412976d3af028a3cc3e'
                        key: {
                            document_key: '860cc68d64994b57a55e3b9bde02eed3'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b475e2b0a97e480bab6f5482b62c5675'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_cap_amount'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'b4c8ce40bf3e410f91d6653daa4baf77'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b4e315c00fc34a8695d598ef5cac6f67'
                        key: {
                            sys_security_acl: '9a0558b01ad9499bab4cefb399332533'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b4e52d047f044db9a4c0ab68edcbcefc'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_required'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b4f1c76abc27484c884dbc6cebdec0c3'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'wholesale'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b56ddd186e0b42f984b4e681b2a32fd3'
                        key: {
                            document_key: '3956b78f24e040eaabce6e58f2ae4930'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b5c3be94538340a6903ad89a21265c13'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b642dc3e449f4fd8bfd5bd1e2ad71bc7'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_applicant_user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b6dd71cb9fc74525acbcd688331449b0'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b6e6f804f7334e2495568819af76649f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b7071a45aca8421d907d3897c0c1142c'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b74c76d7923148838ab21a3f917a8a6d'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b74cf83cbc5d450ea0bd7718dff81d95'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            value: 'le50'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b7d01f49bd044f9c92785890cbcd40b9'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b86ee9d8382c40579d369a4cad79f0d6'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_result'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'b882a16a7f9246c193065eb666ade3b5'
                        key: {
                            sys_ui_form: {
                                id: 'eb8bf96fa6be49f8865f09a70dbd2f2b'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b8bdb55946e24e83b830202f6a490cf8'
                        key: {
                            sys_security_acl: '8a67d36b6b9346f187ae76c8b053934c'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b92f4abe2ead43719e9955db2baee920'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_visibility_scope'
                            value: 'corporate'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b9500c22090c41b4aa6d00928f3e28af'
                        key: {
                            document_key: '93b476b1492d41d388bfbd7788af75c9'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'b97439b1a6634a4e9f09a5373f9da176'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            caption: 'お知らせ'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b980f6a22d61404a94b8cb5b37d87993'
                        key: {
                            sys_security_acl: '446a47d2ca264f91bdb025d862fd72e6'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b98260dcef534ead9c1ffe0ec11b496d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_award_amount'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b99ea37f0663470ab8f54cbc97c26924'
                        key: {
                            document_key: '9024bef0a6a344ada7cc3f6baf1bdede'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b9d403ea770e4507abe7b08721f9675c'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'bcc4cb7897614318876ed91e7b9e49ca'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b9e5ab36df9c4a8f9a2643dbd395b4c9'
                        key: {
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_submitted_on'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b9e9994e55bd4dba9f58918a1b892941'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_publish_status'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'b9f698b530d64fa89a8beb7ba29a0ba3'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '4fd9144f40834b899a3a80cbb12441a1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '申請内容'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ba86336f64b6432e865f900667b36c60'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_approved_by'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ba8a753d94634018b6031e57df17618e'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'baaf0e921b5b4135b8a1a132f0f3866c'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_decided_by'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'babebbf4be4f4ebbb93f3a5038004d1a'
                        key: {
                            sys_ui_action: 'b5456289ce59435b82d242a2f8d65f08'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'bafe93af6a8744dfa2150b8b84c35f17'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_visibility_scope'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bb051f5af0df41bd9ba1208c45429d76'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_sequence'
                            position: '3'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'bb4ece3aa47b40dd96837eff11a16b6a'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bb845f7fc8a3402f9086eaea748fb095'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: 'ff06ab840f20101091d0f00c97767e6d'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bba17e07bb38455d821e51ebd87e2534'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'credit_reminded'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'bbdb926ec386415ea499ab092627cbca'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bbe4278d9f90421d87e7da35c108b5d2'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'bca83e5914d84a18b6ac5d47daeada76'
                        key: {
                            logical_table_name: 'x_dent2_dentsusoke_exp_item'
                            col_name_string: 'u_request'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bcaa6bffd9884e9e97a5fb752f0312bb'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'result_checking'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bd034ac8704243b38fec764de2051fa5'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_total_expense_amount'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bd22a1f1404b4f1db9d1af4300f11f4b'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_rate'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'bd50ed1c763049cb9db1f0aaffc8666c'
                        deleted: true
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bd6d8e2a0fab48398f253970e8f439b0'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                            value: 'gt100'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bd909341c85c442aa2306a7f943fb320'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_agency'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bd97e179379341cb8b7486061d4404b6'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            value: 'defect_fixing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bdb2f6e231954d0ea65987b85e3ea1a9'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_token_expires_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'bdb62a66969b4068aa424daabfc2d22f'
                        key: {
                            sys_security_acl: 'b7fb5f02e76a46abb9ce633c09ad8b10'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bdca5cce8b694aaeb48d0fb36f9711f3'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subsidy_rate_denominator'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'be118c78577842f694b1186099eb224a'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不備確認依頼'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'be679f659220472ab1a8f149b7efb580'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reply_body'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'beada7d22a64445285cb94903eca6f1f'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            value: 'defect_unresolved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'beafa67852954d20aaead95d224fc012'
                        key: {
                            sys_security_acl: '731c2fc4c66e4addb0d6d3cc387d1006'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'bf10504962ce408393ed6a3fe40dead9'
                        key: {
                            sys_ui_action: 'c04d355a69054f55b9392041a24800fa'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bf4dc747ec8744fb9f40fa329bda67c5'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bf6b74d5a64e478594ebd36c512cd04e'
                        key: {
                            document_key: '468c098695074b01b3b98da19fb0621e'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bf90c68a2956439b927a0548b8cc54ad'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'bffd67fd9aa14fbea2f56122f1eac46d'
                        key: {
                            sys_security_acl: 'fbb95cefbb2d4535a507901cd36ba2f4'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'c04579afd501403298fe6c22fcc25994'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_required'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c0bd702bffce496e9a18c6334e24193a'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_detail'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c0ce015018da4e069ee358bb0a9ff069'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_decided_on'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c104db0e96464874a5e5caa898c5ce50'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c11543f444d74e56a65b326ebb5d78ea'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_request'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c16ccbf9a7404354803f2044d39bdc31'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_actor'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c1b51bd23ef44658a1f1877463180545'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c1d6847bd9aa43f2a8dfa4faf01793cf'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_corporate_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c232ba715f0a4101bfd1c491977e5e85'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c26e2dc4457b4c2084687a50d506c901'
                        key: {
                            document_key: '0ce38091504a47e3b6886ab7376424b5'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'c31dc82e71c84468acfcae6f9b8f8814'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: '41b003f7efe648ac934adaef5970bd82'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c344def5666e41059012688dfb60a440'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_award_number'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c39f581f724946f5974a24569e6ec885'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            value: 'financial'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c3abc2da7d8e4823a4bf772f5d610312'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c45b43f2e4a74464811a7e3fb350c928'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            value: 'gt100'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c485d082ef00431f99ab8ced8f8c0d44'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_decided_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c4d494284afa4dcfb75e4485eb96f1b9'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                            value: 'requested'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c4efc0be337a4f009b0c128a9c131324'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c4fd73acded64e218b913f90a2bf01a9'
                        key: {
                            document_key: '91a7b689ecc44b16a22862edd8d12d78'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c52d09f641914adc8c388f26d3e58d73'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c58ba1dace00429f99b8f91728c14319'
                        key: {
                            document_key: '860cc68d64994b57a55e3b9bde02eed3'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c5d73820ff9546989cd4873db5bd0760'
                        key: {
                            document_key: '468c098695074b01b3b98da19fb0621e'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c5df309135044263984c15b15cf670b6'
                        key: {
                            document_key: '3ad79e075f20447c81d848de27c495de'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c5df4e09b0874d8497af451be1653205'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c61f90446552477ab6477b8b73e39bcc'
                        key: {
                            name: 'x_dent2_dentsusoke_read'
                            element: 'u_notice'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'c645b5a859584fd89a56690309a410d2'
                        key: {
                            sys_ui_action: '0976c4e239e643d48c90500b1a24911d'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c70d83a0886b4b7d96595a1942116834'
                        key: {
                            document_key: '3d0c7bd69fb8497c83d4352372cafaa4'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'par_dashboard_canvas'
                        id: 'c71269892f0449fdb7033e8f1146b117'
                        key: {
                            dashboard: '0ac41e438c0240e5889534fd7571fb44'
                            dashboard_tab: '3f521256a7b2457ebd944ce27c683666'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c7936de8340c4274a21c29460acaf8b6'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'first_name'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c79613862ec84cbbb34da7d46fa84750'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_subsidy_cap_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c7ce4aa96f5a4482b6d5baaf21f9de90'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'defect_answered'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c80393e3b3184b7faff8ebdd47cd16e8'
                        key: {
                            document_key: 'bb9d37da4d9a4156b8950ca376cd6ca0'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c81063960bfc4538abf19841a0a82cfc'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c85c44f093724560964da6e8c326ca51'
                        key: {
                            document_key: '81366ae4646a4aceb43cc43045f96e89'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'c8e46c4c1dea4d0bb8f07d0fc5760c81'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c97328dca4e4465e86f57a748af4510e'
                        key: {
                            document_key: '860cc68d64994b57a55e3b9bde02eed3'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'ca6462ef86a94528b8f6662017ae5a79'
                        key: {
                            id: 'x_dent2_dentsusoke_inquiries'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'caaddef2b20d404c92f22cb8f99a4237'
                        key: {
                            sys_ui_form: {
                                id: '4250953136334864aec21bf0dfeb0d96'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'd65b71a023394995aa0110967d3ea132'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cbb4afdc31684e028f7ad30a43746c98'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_defect_fix_expires_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cc043ae79bb84afe904347113910f82a'
                        key: {
                            document_key: '80b84451e9544c1aae7c3276410bf9eb'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'cc1b607ddff14c93b8620b5baed501f4'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            caption: '業種別基準'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cc20e0b3bfb84fe580e341be27c63823'
                        key: {
                            sys_security_acl: 'c746446834a14a3d9ca245042be0e169'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cc26cd7b820c453989651471355291dc'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cc3ee6d7932645a8961535ac3ce5910e'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_required'
                            value: 'exempt'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'cc7244e15eaa41eab7620cd4921cb3b9'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '06c68f9cad6d4358981bbb7c80caceb4'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'cc727135775947449b145921465a3065'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '9af9abfe59284966acab733ee817b62f'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cc86a3227d1643c0b43d60294276cfde'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_created_by_applicant'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cc8f9a1aab3b4feba94d91b63a88a628'
                        key: {
                            sys_security_acl: 'fbb95cefbb2d4535a507901cd36ba2f4'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cce677cee6e844e28cd150cb801c5d6b'
                        key: {
                            document_key: 'aa2565fdcaa44b1d8bad614efc4f95a5'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cce9adc21dda4c8b980f535b095a9b14'
                        key: {
                            document_key: '39a8791f9c0d4c68811e3a35ed0e0548'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'cdb191fc0906437aafb44c78a168f998'
                        key: {
                            id: 'x_dent2_dentsusoke_signup'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cdfc0107154a4161936efb414b83a671'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_entity_type'
                            value: 'corporate'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ce550c0c12b54e5c89ec25ea05ceb7de'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                        key: {
                            name: 'x_dent2_dentsusoke.system_admin'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'ce91fe26f3bf48c7ada7fbb87095f7bb'
                        key: {
                            sys_ui_action: '03b3531cc65b4b12b055d5df8a35567e'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'ceda5bc301ad471ea4256bfc39b82ca0'
                        key: {
                            id: 'x_dent2_dentsusoke_profile'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cef678dda2b74fd9bc452ea5d5ab0d5c'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_password_reset_token'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cf5267496c0144e2ad22d6f1371a4021'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_assigned_to'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cf5f003c0461463181bb649a54757c48'
                        key: {
                            sys_security_acl: '3deff13c7cbe4c71ab18d6a959e869bb'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cf93303eedcf421a8a2beeecd3a9266d'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'credit_exempt'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'cfcc69f2f1e34ea9937e5be39bc52f27'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            id: '7a8f4a1d91f5400a98737d475a6e097c'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd01bfb7cae4242a584e3c2b65ec638cc'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_withdrawal_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd0431582ef9c4a81a123c56b62bf64ec'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'consented'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd0d09a38f1f14c25a2ef489a46112f58'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '17'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd1321ae700ee4e268c8528f714070114'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd16827d95571433c92c2aa0f934107dd'
                        deleted: true
                        key: {
                            document_key: '6a4cd1cc1fdc435a9e75583729df47aa'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd199316b1f114186a915ec086165b6ed'
                        key: {
                            document_key: '4225340978364f9da32126893d274b77'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd19ae4dadbae4d0ba07bd84b008554c8'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'd19b797e3ce345d98e4bc312c2f7a066'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            id: '0da20af899b748eeb9607cc09a153e2a'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'd1b9c3def76f4815aaff36d8744d5e0b'
                        key: {
                            ui_action: 'b5456289ce59435b82d242a2f8d65f08'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'd1c9fe8af1bf40448edc1e8beaac39fc'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '5d0f6d8f09ee4ad4917d26c3ea17886e'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd2209895fc2f40838938bb4c755aa78e'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            value: 'le50'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd23f4efaec8a448bb79b8a41c969f25d'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_email_notify_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd2b92a6c6e5543b0a871c41a980479ac'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_prior_year_award_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd2fd34d90d1745279b3e2c15a46f20f8'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'credit_judged'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd3ca03f16f904e99b56ad9b1a3361319'
                        key: {
                            document_key: 'e67bb497042b456aa20f8cc24c672fc1'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd3f8b9e546b140239a1e76f7b021185b'
                        key: {
                            sys_ui_section: {
                                id: 'cc1b607ddff14c93b8620b5baed501f4'
                                key: {
                                    name: 'x_dent2_dentsusoke_industry'
                                    caption: '業種別基準'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_active'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'd424b2c595aa4de29e693afda93bdb73'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '補助金額'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd43d91576f6d43df913c85b0475c8f9a'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_rate_numerator'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd48b3a710dd64fda8f47e3a1d83b024f'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_approved_by'
                            position: '16'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd4b4f529d20e41e3ae487c9c52e11403'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd4b89a2f23e74bd99292c9db25eaca06'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'd4f1391b50c24b86b4e09be816ecf35f'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd50f855d1a8a443fad04aa51115caaf0'
                        key: {
                            sys_security_acl: '9d0b1f9a62a9425c87226c402cb1e7d3'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'd5ce763f979a41869e2c255295952064'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            caption: '補助上限額'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd62c472b95214af4b21e7210502656c5'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd633a5a9f24d40f09295c691b6aa2c4b'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_name'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'd65b71a023394995aa0110967d3ea132'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '信用調査'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd6c5c284ba52496d905947d2b306611f'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_sso_external_id'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd74bc92451cd47d3bd55ed69505a1da7'
                        key: {
                            sys_security_acl: 'ae331f22d8d5457abf8638da84570019'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'd83d2de4885e4e42bbdf96119140d45e'
                        key: {
                            sys_ui_action: '08efccdbea1e48c2940ed36342e55f91'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd8588c643fb6475db12bd8a22b4fcd69'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_password_reset_expires_on'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'd8637a057708419884a967ef36842562'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd88321bf816540dabf55571b624355a0'
                        key: {
                            document_key: 'b2d316a958524399a15fa5c71ebc5626'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd8d93ef23e894db891219ff7472c8f1e'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd8f7cc2695b7456bb807ab438264498b'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_request'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd9c6a1d324e64feeac4605a515169b34'
                        key: {
                            document_key: '84c1ad1f66454764bac4d30ed6b4c392'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'da0b74489ddc406481ecfe417d76e67c'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_required'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'da236d1c30ed4eb18be7fdd87d5be2fd'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_submitted_on'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'dac4418e3228449e8158cd1a27735df3'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_employee_count_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dac47e0bb1cc4962a346528601241dfa'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'u_days'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'db15857637894a5196aebb69574fded9'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'db38ce5aca0a47cd88610e1b17fb64ce'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_capital'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dba910b7d7e749a198875145d7856a61'
                        key: {
                            sys_security_acl: 'b998ad38456144d2b468ecacf33c082a'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'dbbf858e12294f8ba2a01c002a800750'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dc976b5dfae74e9c8e12988502336248'
                        key: {
                            document_key: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dcc004d4197240b081494ab3d2964577'
                        key: {
                            document_key: '9162d4ad35b940f2a04e688a6064671d'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dcd54d26be8847e08b498d99d5599e22'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'dcdf0a58af1545cd922e409305b5c3cc'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dcf97547bfac42afbeaabe855d4365f0'
                        key: {
                            document_key: '01de1fca560541748f357179c17bd032'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dd194602818248e4a584a7008c398a90'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_document_type'
                            value: 'special'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'dd21229e4ebf4086a8b30b9aa6da6a1c'
                        key: {
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dd3e991b3c9c4dc481a19be57f1ae6cd'
                        key: {
                            document_key: '41b003f7efe648ac934adaef5970bd82'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ddec7af7dfb54963a3959e7eb6fd510c'
                        key: {
                            document_key: '4225340978364f9da32126893d274b77'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ddf347f3768445299853130dea7f7c20'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_sales_increase_rate'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ddf8c11ec0f34b97936e45861e3b04c6'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_entity_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de203f9d96d44f838221c6d22bb75f88'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_due_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'de227b43724f425ca57e65aeaa740c40'
                        key: {
                            sys_ui_section: {
                                id: '367c50f9221540c0ac71f81daefc6443'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '調査結果'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_updated_by_staff'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'de3a0199ed3c46c087ca7aa0a2e85f0a'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_registration_issue_note'
                            position: '18'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'de40f1d1dbac45f2870c4a84c1c82acb'
                        key: {
                            ui_action: '35f903e70c5f424b99790c1141e44c69'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'de4bea9d3f10454ab815ec4b3f8a2e78'
                        key: {
                            sys_ui_action: 'f69a62ebe3ed46498bbcdaa233d0bfd6'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'de5214ec69324eb69a6ce524a695c3ed'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_special_measure_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'de59bc15c4324667ba35a39d727a2362'
                        key: {
                            sys_ui_action: '93a413533245418894d89d425feba32b'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'de719e7e0331413fbc4058c2ac161e99'
                        key: {
                            sys_ui_action: '1d52bee233404a4a9402093a85a54341'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'de96fed2596b4044b52407e242370e9e'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_award_number_for_sync'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'dee0ccc80f57430db5ab2de2f78ddaea'
                        key: {
                            id: 'x_dent2_dentsusoke_apply'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'df13a3eb1a704caf87cc84fe02cf1e63'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_priority'
                            value: 'low'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'df302f8e59854e90ad5430b0a802b2db'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'df57d1faf9f64c04bef8baa0a17450f2'
                        key: {
                            document_key: 'e8bcf8b1f14f42328096fe43135a2f41'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dff2384d644e4028a1dfe0b998a994ae'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_defect_fix_token'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e00b7ddd73d94db9aa949ed785dddab5'
                        key: {
                            sys_ui_section: {
                                id: '4069a36112c14d779923d423af6cf42c'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: '登録審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_user_type'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e03cf6a07e49452b874ffb744d83d8b7'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reviewed_by'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e05a57b519c74e42a829177718816e86'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e076cbc7d316433f9552238b38362cc5'
                        key: {
                            sys_ui_section: {
                                id: 'f5e33ac167574a208c8c07bae55a1914'
                                key: {
                                    name: 'x_dent2_dentsusoke_user'
                                    caption: 'アカウント・認証'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_mfa_enabled'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e0a33e16f0124d6ab5ef0f3cdf1185e2'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e0d48d8a8a4a40b9be7ac7f1e55b1fc7'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'u_employee_limit'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e0ff45c95d144b38b97a48771d8e4484'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_reject_reason_code'
                            value: 'sales_invalid'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e1e5a07999c84712a1a45994cd7c2823'
                        key: {
                            document_key: 'c59d061bfec74c508aa18a171a37a849'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e238cf27f20c45eca8bc630c4cae304d'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_defect_fix_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e24f5f971d8944d29bb78ae0ac5cb419'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e2aa32ef4f2245eab8ee2cdf7f940386'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                            value: 'checked'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e2c75a4933524dcbbe4f12bd9fcad870'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_credit_required'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e2ec9fccb731477ab11db360cd588de7'
                        key: {
                            sys_security_acl: '0341cfdf2415420faadf46da2966b07f'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e30bd5b7d3854f6c890d41b37f2e95ff'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_order'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e33aacee05de45afa12e3233110fea90'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e3486ef1634143a39466bb5f0a6dd452'
                        key: {
                            sys_security_acl: 'cd6b2c33f025451baf464bceb3746b0e'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3649368a4224af5abb9bac2d85ccc87'
                        key: {
                            name: 'x_dent2_dentsusoke_industry'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3d0195fedf04600bfbc8bac771e583e'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3d8f67fe6ab47388d0771df911d4b9d'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_request'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e40728b157224c2cb3941ee9c935019c'
                        key: {
                            document_key: 'cec016c6fab64bdab4ab8f2d5bc2c85b'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'e47c49c7f5cd469b932432783d311352'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'e4b5500b2e7e401e97d5aa0d98c10ad1'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '不備確認依頼'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e5d8c58bcf1342a698ed85851674ce56'
                        key: {
                            document_key: 'd2c22318dbc14f73a7f78dd79d792ce5'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e645f009d36843b9a5a4902da29e5a21'
                        key: {
                            document_key: 'b2d316a958524399a15fa5c71ebc5626'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e689d5adb6404e3fb3621ad7182fd821'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e68cf77a26bc4309920b4b3306ccc254'
                        key: {
                            sys_security_acl: 'bb80c9294748445c8d1e780d8abf4edb'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e6b103755ebe4da7afd09cba20a64502'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'e6be7030129d4ba8934087cd86a1a098'
                        key: {
                            sys_ui_action: '2301b4f8ddc64051961e205a53254a24'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e7001e14ab494ef7a432147d13cc2e9e'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e77974f7aba24f69b8d680cd5055e499'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_submitted_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e78957196e124ca8a43aebf4a04e6734'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e7dd6caf29974cf89397001f0c1816f2'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                            value: 'not_executed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'e80f6e54e2de4582ae8ef260b0c7ab5c'
                        key: {
                            sys_ui_action: '28599088303940be8dbbfb380235134b'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e82515fb6b284851afe6975267ecbd22'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e85be3efdc8047d49be4701e892567d4'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                            value: 'le50'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e8a4888181fe4e60a538af34dddd6463'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_mfa_enabled'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e8af5a9f8f3d4a9986c8741319c228d4'
                        key: {
                            document_key: '97c07d08d34a44458e8b625de855d82e'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e9189f6cd40848b8a42ebf706827e4ac'
                        key: {
                            name: 'x_dent2_dentsusoke_expert_fee'
                            element: 'u_daily_cap_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'e9358c136cfe4c8b8fe054eedac59358'
                        key: {
                            name: 'x_dent2_dentsusoke_expense'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'e93a32381c1a4dfe94a0903c3f41284a'
                        key: {
                            sys_ui_form: {
                                id: '39f56547f4024830b161952a3f69823b'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '6768f15befef4f33a3653f5cd34c57fc'
                                key: {
                                    name: 'x_dent2_dentsusoke_expense'
                                    caption: '対象経費区分'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e93c35095d2f418191de703125be6386'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_salesforce_account_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e9c3437d384a459a8916989845078ce6'
                        key: {
                            document_key: 'c59d061bfec74c508aa18a171a37a849'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'e9d27b7873bb49a68831b18039dee2b9'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            id: '2f7f3a02a1c347fc9a64e4c679fadb9f'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ea07417dccd9412f986f041af3efacdc'
                        key: {
                            document_key: 'f09c19c4230e444da6ac926d7036a20c'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'eaaef872f9f645f5b5cf8f4f8ab4b9eb'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_active'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'eb28bc62084a4553a377e1f9f22dc0ea'
                        key: {
                            document_key: '3d0c7bd69fb8497c83d4352372cafaa4'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'eb8bf96fa6be49f8865f09a70dbd2f2b'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ec4a5ce35b554776b761e2c11286418a'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_rate_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ec4a9aa9a9a346f595e52a81f135ea29'
                        key: {
                            name: 'x_dent2_dentsusoke_inquiry'
                            element: 'u_received_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'ec6ab7a5e98a4a609dcd62aa6af10ad9'
                        key: {
                            sys_ui_form: {
                                id: 'bbdb926ec386415ea499ab092627cbca'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ec9e70d778234fb4beb551276bfccc3a'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ed5653c3c5fb4deb89c27d550ee999c7'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'cdb96b6b6fab4c8ea9a035e2759023c6'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ee03e255b8ea4d85864e90abfa564575'
                        key: {
                            sys_ui_section: {
                                id: 'd5ce763f979a41869e2c255295952064'
                                key: {
                                    name: 'x_dent2_dentsusoke_cap'
                                    caption: '補助上限額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'ee511650741a4f61adc5561477fa990a'
                        key: {
                            ui_action: '8661e15c4b7247659881f33b285915c6'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'ee5c5ff615014472901524d822e86a9b'
                        key: {
                            role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                            contains: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ee67c2e08d0f4f9dbcb3c37b2fa33741'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '39a8791f9c0d4c68811e3a35ed0e0548'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ee7bfed6488a4f7a91d399e889060ce7'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'eec5ef75260344dba5603ca6fcf8640e'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            caption: '不採択'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'eedb2a3b5d694cfbb87a710f9c5ee064'
                        key: {
                            sys_security_acl: 'ee4891e0dbe24c5a90062ec0cfbea757'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ef56582ac1c34672b3808af27efa6512'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'efba378da20c4f60be42f6b56db3cb58'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_body'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'efe9ec6b0d854b3ba6908d867dd65f45'
                        key: {
                            document_key: '860cc68d64994b57a55e3b9bde02eed3'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f08972cd3e9c42059132fc663f17a95d'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_order'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f13d9af235b7466ba5c0239bae320c39'
                        key: {
                            sys_ui_section: {
                                id: 'b97439b1a6634a4e9f09a5373f9da176'
                                key: {
                                    name: 'x_dent2_dentsusoke_notice'
                                    caption: 'お知らせ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f1448a80d5ce40b784ba931d8137d533'
                        key: {
                            document_key: '286505154e094dc98214ffdf6342b9d3'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f17aece2716744179681128fad01b480'
                        key: {
                            sys_ui_section: {
                                id: '001db395750c485db9a57dbd6398997f'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '一次審査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'f208afbaf04a49ca88a810f000a69531'
                        deleted: true
                        key: {
                            id: 'x_dent2_dentsusoke_provisioning'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f260fb4443f84fbc9ff77435da0674e5'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '1bcd0bd10f2e4a939fa40be282af67bd'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f2852ae167cd44d6abc68cbff36099a9'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_status'
                            value: 'first_review_done'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: 'f2ab8bc9ebe64bfaa9143300a51b36a2'
                        key: {
                            id: 'x_dent2_dentsusoke_apply_conf'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f2eff2c8d3b94918bfc72b678fcfc6e0'
                        key: {
                            document_key: '3956b78f24e040eaabce6e58f2ae4930'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f310298e2fc54d279e21f1809bbfb4cd'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_due_on'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f3205633982e43ef9d1db4f0f7f32385'
                        key: {
                            document_key: '220169c003db43af9453e7b8d3426330'
                            variable: '8c07aba5ff6033008d3f5d9ad53bf13b'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            caption: '信用調査'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f3836e8124644ee0b94431106a0e2157'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_rate_denominator'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f38c2de5d57a4e77ae4070a44a259ec5'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_duplicate_check_result'
                            value: 'duplicate_confirmed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f4067b85f7b74533b3ce1e9482f340c8'
                        key: {
                            document_key: '9024bef0a6a344ada7cc3f6baf1bdede'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'f4a4df3d5e7746ddad12cb2406fe07f9'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f4c1ffd982044973b943eb8eb61bdc06'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subsidy_rate'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f4d01dc6fa4b43ae875efb1d4ad0e25d'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'manufacturing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f4d0de4172584a7e9f6d842efb9e77e0'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_from_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f51d2614003f4045878b4a32f5ad94ad'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '2aa2a114e27b47a29251bedf507a3034'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f521f8cd22be4cfab3628c585d7b5ced'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_employee_count_category'
                            value: 'le20'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f58952cfd2c84a399b4bc6ebaf214f30'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '00f7c37f3ccc4819848c2b6c77837884'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '信用調査・採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_decided_by'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f5b5173737d6450fad07095ed95ad512'
                        key: {
                            sys_ui_section: {
                                id: '3442315a354841769e99f9f9578fb3f0'
                                key: {
                                    name: 'x_dent2_dentsusoke_rate'
                                    caption: '補助率'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_note'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f5bc6649f81b42d6a423961fdcbb87c0'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: 'de07742e5b3e44ada9012477f17b7109'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f5cda4db959d49ed98f3540253cdad54'
                        key: {
                            document_key: '9af9abfe59284966acab733ee817b62f'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'par_dashboard_canvas'
                        id: 'f5d3127acc18417080ba7fbcecb9e042'
                        key: {
                            dashboard: '0ac41e438c0240e5889534fd7571fb44'
                            dashboard_tab: '6d714721e556478690181b62cd38cd4f'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'f5e33ac167574a208c8c07bae55a1914'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            caption: 'アカウント・認証'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f5f10fe178ce4318b8be5219686bf4e8'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_award_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'f67852c557534816bc50b9eb5f5e87af'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_review_result'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f67fa90ae938429a9ade4c814229e0a3'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subsidy_cap_amount'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f69f5bb1d9004e5480dcb54c28224849'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f70f4fb2d32a46178cfc0306d67d1659'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'construction'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f738aee098c74bdd90d6117d4532501f'
                        key: {
                            sys_security_acl: 'eaf3c900849841cfa80acd77d1c42b76'
                            sys_user_role: {
                                id: '9af77c86f26b41259c585d9aaa5f40a4'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f752f4dac88a467e8ee0e411dde24e95'
                        key: {
                            name: 'x_dent2_dentsusoke_req_doc'
                            element: 'u_submitted'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f75e20cc332b4b5aad072839f4160ce9'
                        key: {
                            sys_security_acl: 'b006c349bbe442c4b61ac08c4e324a10'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f77c2217f5cc4591818a752f7ac22797'
                        key: {
                            name: 'x_dent2_dentsusoke_entity'
                            element: 'u_industry'
                            value: 'retail'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f7a5f773fa6b4485990e2fb1721c45d0'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f7f775239aeb4835a0d1666efd45a81b'
                        key: {
                            document_key: '06c68f9cad6d4358981bbb7c80caceb4'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f7fe699ad14549d4a3d5075b54b9cdf7'
                        key: {
                            sys_security_acl: '46d414a9474a4348a4e0a3de0f92452c'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f84470d18bb6419d951c269f3aed44d0'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_state'
                            value: 'received'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f84e9d9efa2c404f882bd36e94618bb9'
                        key: {
                            sys_ui_section: {
                                id: '6763f39bf7224346bd856c4a4f8aea08'
                                key: {
                                    name: 'x_dent2_dentsusoke_inquiry'
                                    caption: '問合せ'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subject'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f872c5f3795c4e65b40b7dc76661c2d2'
                        key: {
                            name: 'x_dent2_dentsusoke_exp_item'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f8731a43cd704007ac002cf2a8cadf67'
                        key: {
                            document_key: 'e9ac8e5ec6484702a7d7b1195d5c0255'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f879b0e38a3c4c09b3a19636dc50ccc5'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_visibility_scope'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f9198cbf0d1744e4a12c02b6b5994f43'
                        key: {
                            document_key: '97f75e9464f74979b8e61e63c3347c33'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f976ee2afa1941fe8b2079c68093aa6f'
                        key: {
                            sys_ui_section: {
                                id: '9a0c86fae0914587a448281c562cee39'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '採択判定'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_decided_on'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f9b84e87b1444d91868507212143aae0'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_action'
                            value: 'credit_received'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f9fd54759d7248bcaed27452f2b9df43'
                        key: {
                            name: 'x_dent2_dentsusoke_user'
                            element: 'u_registration_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fa087dd34d85413d9e70c470380fa246'
                        key: {
                            name: 'x_dent2_dentsusoke_cap'
                            element: 'u_special_measure_flag'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fa73bbefa5824af88f825b4d32b0a2ee'
                        key: {
                            sys_security_acl: '6688befb44ce4e03919fab5b9e66c9b7'
                            sys_user_role: {
                                id: 'ce782c96f4b24d0aa8ef709af9b9d63b'
                                key: {
                                    name: 'x_dent2_dentsusoke.system_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fb5a898c29d54df480af373a33dc8953'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_created_by_staff'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'fb72765e11d345fbba92b5856af23b22'
                        key: {
                            sys_ui_action: '969407a0aab34168813b190e3d7401c1'
                            sys_user_role: {
                                id: 'b1d4b95e5d0e417e815aac506e5c19e6'
                                key: {
                                    name: 'x_dent2_dentsusoke.staff_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'fb779456ef514b6e8c513bbcd3620d37'
                        key: {
                            field: 'script'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            id: '0014f5c3485f4020994c15aa1d44852c'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fb9c0d86bc0248c780c21e0387e446ae'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_approved_expense_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fbb7033b44d04e178819a35d57732d4b'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'eec5ef75260344dba5603ca6fcf8640e'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '不採択'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_reject_reason_code'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fbbeb9276e844849a9d021d35824d069'
                        key: {
                            name: 'x_dent2_dentsusoke_rate'
                            element: 'u_employee_count_category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fbc7dc0fb0f74ef286ae41842d0e8893'
                        key: {
                            name: 'x_dent2_dentsusoke_notice'
                            element: 'u_priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fc4dfb1cf2cb44efbd07dd98d2c04131'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_subsidy_rate_numerator'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fc7c8682f05c42e9915ce940c8fae436'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_applicant_user'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fcdb5bbb098e4840a703c49958e59fbc'
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_application_round'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fd3078e289764f8db5630cc46f7a4c86'
                        key: {
                            sys_ui_section: {
                                id: 'f331f4cc8bdc4ddf80d58b0da7d989e5'
                                key: {
                                    name: 'x_dent2_dentsusoke_credit'
                                    caption: '信用調査'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_state'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fd5dfd9cc8494130a2aee56aab9deeae'
                        key: {
                            sys_security_acl: '895de9c7e3744506970310aa0e6021ca'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fdbfd9d3d0ab40e9a7c1e4d765a4b1e8'
                        key: {
                            sys_ui_section: {
                                id: 'd424b2c595aa4de29e693afda93bdb73'
                                key: {
                                    name: 'x_dent2_dentsusoke_request'
                                    caption: '補助金額'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fef115bdf81346d3acee7f0598c19309'
                        key: {
                            name: 'x_dent2_dentsusoke_req_log'
                            element: 'u_visible_to_applicant'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ff33aae80c7847c8a1807ddc4dd43dc2'
                        deleted: true
                        key: {
                            name: 'x_dent2_dentsusoke_request'
                            element: 'u_defect_fix_expires_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ff38d5b1e1414978babb84ff6fede535'
                        key: {
                            sys_ui_section: {
                                id: '199a94fddf9b4c84810d9e1396dc2c2a'
                                key: {
                                    name: 'x_dent2_dentsusoke_expert_fee'
                                    caption: '専門家経費日額上限'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_active'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ffbdcd0fcbe44272a405089b3b7d6bf6'
                        key: {
                            name: 'x_dent2_dentsusoke_credit'
                            element: 'u_sequence'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ffc17a922067449a8f95a7f71c7a277c'
                        key: {
                            document_key: 'bb9d37da4d9a4156b8950ca376cd6ca0'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ffff917698c548869e32691965c6cf68'
                        key: {
                            sys_security_acl: '94e95da27eca429fbe42a787fa1e157f'
                            sys_user_role: {
                                id: '9248e3503ee442b78432e7cda60f841e'
                                key: {
                                    name: 'x_dent2_dentsusoke.applicant'
                                }
                            }
                        }
                    },
                ]
            }
        }
    }
}
