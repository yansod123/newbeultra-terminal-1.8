(function($){
'use strict';

function toggleSourcePanels(container, source){
    container.find('.nbu-t-font-panel-upload').toggle(source==='upload');
    container.find('.nbu-t-font-panel-url').toggle(source==='url');
}

function syncSetting(fieldId, value){
    if(window.wp && wp.customize){
        wp.customize(fieldId, function(setting){
            setting.set(value);
        });
    }
}

$(document).on('change','.nbu-t-font-source-radio',function(){
    var $radio=$(this);
    var $container=$radio.closest('.customize-control');
    var source=$radio.val();
    toggleSourcePanels($container,source);
    var $hiddenSource=$container.find('.nbu-t-font-source-field');
    var fieldId=$hiddenSource.data('sync-field');
    if(fieldId) syncSetting(fieldId,source);
});

$(document).on('click','.nbu-t-font-upload',function(e){
    e.preventDefault();
    var $btn=$(this);
    var $container=$btn.closest('.nbu-t-font-panel-upload');
    var $hidden=$container.find('.nbu-t-font-attachment-field');
    var fieldId=$hidden.data('sync-field');
    var frame=wp.media({
        title:'选择字体文件',
        library:{type:['application/font-woff2','application/font-woff','font','application/x-font-ttf','application/x-font-otf','application/octet-stream']},
        button:{text:'使用此文件'},
        multiple:false
    });
    frame.on('select',function(){
        var attachment=frame.state().get('selection').first().toJSON();
        $hidden.val(attachment.id);
        $container.find('.nbu-t-font-filename').text(attachment.filename||attachment.title||'');
        if(fieldId) syncSetting(fieldId,attachment.id);
    });
    frame.open();
});

$(document).on('click','.nbu-t-font-check',function(e){
    e.preventDefault();
    var $btn=$(this);
    var $panel=$btn.closest('.nbu-t-font-panel-url');
    var $input=$panel.find('.nbu-t-font-url-input');
    var $result=$panel.find('.nbu-t-font-check-result');
    var url=$input.val();
    var fieldId=$input.data('sync-field');
    if(fieldId) syncSetting(fieldId,url);
    if(!url){
        $result.removeClass('ok').addClass('fail').text('请先输入链接');
        return;
    }
    $result.removeClass('ok fail').text('检测中…');
    $btn.prop('disabled',true);
    $.post(nbuTFontControl.ajaxUrl,{action:'nbu_t_check_font_url',nonce:nbuTFontControl.nonce,url:url})
    .done(function(resp){
        if(resp && resp.success){
            $result.removeClass('fail').addClass('ok').text('✓ '+(resp.data&&resp.data.message?resp.data.message:'链接可用'));
        }else{
            $result.removeClass('ok').addClass('fail').text('✗ '+(resp.data&&resp.data.message?resp.data.message:'未检测到有效字体，字体未生效'));
        }
    })
    .fail(function(){
        $result.removeClass('ok').addClass('fail').text('✗ 检测请求失败，字体未生效');
    })
    .always(function(){
        $btn.prop('disabled',false);
    });
});

$(document).on('input','.nbu-t-font-url-input',function(){
    var $input=$(this);
    var fieldId=$input.data('sync-field');
    if(fieldId) syncSetting(fieldId,$input.val());
});

})(jQuery);
