<?php
if(!defined('ABSPATH'))exit;define('NBU_T_VER','1.22.0');
function nbu_t_setup(){add_theme_support('title-tag');add_theme_support('post-thumbnails');}add_action('after_setup_theme','nbu_t_setup');
function nbu_t_assets(){wp_enqueue_style('nbu-terminal',get_stylesheet_uri(),array(),NBU_T_VER);wp_enqueue_script('nbu-terminal',get_template_directory_uri().'/assets/js/app.js',array(),NBU_T_VER,true);wp_enqueue_script('nbu-terminal-crt',get_template_directory_uri().'/assets/js/crt-companion.js',array(),NBU_T_VER,true);}add_action('wp_enqueue_scripts','nbu_t_assets');
function nbu_t_login_style(){wp_enqueue_style('nbu-terminal-login',get_template_directory_uri().'/assets/css/login.css',array(),NBU_T_VER);}add_action('login_enqueue_scripts','nbu_t_login_style');
function nbu_t_login_brand($url){return home_url('/');}add_filter('login_headerurl','nbu_t_login_brand');
function nbu_t_login_title($title){return get_bloginfo('name').' — Sign in';}add_filter('login_headertext','nbu_t_login_title');

if(class_exists('WP_Customize_Control') && !class_exists('NBU_T_Range_Control')){
class NBU_T_Range_Control extends WP_Customize_Control {
    public $type='nbu_t_range';
    public $input_attrs=array();
    public function render_content(){
        $min=isset($this->input_attrs['min'])?$this->input_attrs['min']:0;
        $max=isset($this->input_attrs['max'])?$this->input_attrs['max']:100;
        $step=isset($this->input_attrs['step'])?$this->input_attrs['step']:1;
        ?>
        <label>
            <?php if(!empty($this->label)):?><span class="customize-control-title"><?php echo esc_html($this->label);?></span><?php endif;?>
            <?php if(!empty($this->description)):?><span class="description customize-control-description"><?php echo esc_html($this->description);?></span><?php endif;?>
            <input type="range" min="<?php echo esc_attr($min);?>" max="<?php echo esc_attr($max);?>" step="<?php echo esc_attr($step);?>" value="<?php echo esc_attr($this->value());?>" style="width:100%" <?php $this->link();?> oninput="this.nextElementSibling.textContent=this.value">
            <output style="display:block;text-align:right;font-size:11px;color:#777;"><?php echo esc_html($this->value());?></output>
        </label>
        <?php
    }
}
}

function nbu_t_customize($c){
$c->add_section('nbu_t',array('title'=>'新欧拉主题外观','priority'=>30));
$c->add_setting('nbu_t_palette',array('default'=>'termius','sanitize_callback'=>'sanitize_key'));$c->add_control('nbu_t_palette',array('section'=>'nbu_t','label'=>'默认配色方案','description'=>'全站通用。访客端无法修改。','type'=>'select','choices'=>array('termius'=>'Termius 深色','nord'=>'Nord 深色','dracula'=>'Dracula','monokai'=>'Monokai','hackerblue'=>'黑客蓝','hackergreen'=>'黑客绿','flexoki'=>'Flexoki 深色','light'=>'浅色工作台')));
$c->add_setting('nbu_t_radius',array('default'=>'16','sanitize_callback'=>'absint'));$c->add_control('nbu_t_radius',array('section'=>'nbu_t','label'=>'面板圆角','type'=>'select','choices'=>array('10'=>'10px','14'=>'14px','16'=>'16px','20'=>'20px')));
$c->add_setting('nbu_t_density',array('default'=>'comfortable','sanitize_callback'=>'sanitize_key'));$c->add_control('nbu_t_density',array('section'=>'nbu_t','label'=>'界面密度','type'=>'select','choices'=>array('compact'=>'紧凑','comfortable'=>'适中','spacious'=>'宽松')));

$c->add_section('nbu_t_crt',array('title'=>'CRT 显示器伴侣','priority'=>31));

$c->add_setting('nbu_t_crt_color',array('default'=>'#00ff41','sanitize_callback'=>'sanitize_hex_color'));$c->add_control(new WP_Customize_Color_Control($c,'nbu_t_crt_color',array('section'=>'nbu_t_crt','label'=>'屏幕显示颜色')));

$c->add_setting('nbu_t_crt_case_color',array('default'=>'#26272b','sanitize_callback'=>'sanitize_hex_color'));$c->add_control(new WP_Customize_Color_Control($c,'nbu_t_crt_case_color',array('section'=>'nbu_t_crt','label'=>'显示器外壳（边框）颜色')));

$c->add_setting('nbu_t_crt_ledon_color',array('default'=>'#2ee06a','sanitize_callback'=>'sanitize_hex_color'));$c->add_control(new WP_Customize_Color_Control($c,'nbu_t_crt_ledon_color',array('section'=>'nbu_t_crt','label'=>'显示器 LED 指示灯颜色','description'=>'机身左上角 ON 指示灯')));

$c->add_setting('nbu_t_crt_mode',array('default'=>'scanline','sanitize_callback'=>'sanitize_key'));$c->add_control('nbu_t_crt_mode',array('section'=>'nbu_t_crt','label'=>'效果模式','description'=>'切换屏幕上叠加的复古纹理效果类型','type'=>'select','choices'=>array('scanline'=>'横向扫描线','pixel'=>'像素颗粒')));

$c->add_setting('nbu_t_crt_scanlines',array('default'=>35,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_scanlines',array('section'=>'nbu_t_crt','label'=>'扫描线密度','description'=>'0 为完全关闭，数值越大扫描线越明显','input_attrs'=>array('min'=>0,'max'=>100,'step'=>1))));

$c->add_setting('nbu_t_crt_scanline_thickness',array('default'=>2,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_scanline_thickness',array('section'=>'nbu_t_crt','label'=>'扫描线粗细','description'=>'控制每条扫描线本身的像素厚度','input_attrs'=>array('min'=>1,'max'=>6,'step'=>1))));

$c->add_setting('nbu_t_crt_scan_alpha',array('default'=>35,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_scan_alpha',array('section'=>'nbu_t_crt','label'=>'扫描线透明度','description'=>'独立控制扫描线的深浅，数值越大扫描线越黑越明显','input_attrs'=>array('min'=>0,'max'=>100,'step'=>5))));

$c->add_setting('nbu_t_crt_pixel_size',array('default'=>50,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_pixel_size',array('section'=>'nbu_t_crt','label'=>'像素块密度','description'=>'数值越大像素颗粒越密集越细小','input_attrs'=>array('min'=>0,'max'=>100,'step'=>1))));

$c->add_setting('nbu_t_crt_pixel_thickness',array('default'=>1,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_pixel_thickness',array('section'=>'nbu_t_crt','label'=>'像素块网格粗细','description'=>'控制像素块之间网格线的像素厚度','input_attrs'=>array('min'=>1,'max'=>6,'step'=>1))));

$c->add_setting('nbu_t_crt_pixel_alpha',array('default'=>35,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_pixel_alpha',array('section'=>'nbu_t_crt','label'=>'像素块透明度','description'=>'独立控制像素颗粒的深浅，数值越大颗粒感越明显','input_attrs'=>array('min'=>0,'max'=>100,'step'=>5))));

$c->add_setting('nbu_t_crt_glow',array('default'=>50,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_glow',array('section'=>'nbu_t_crt','label'=>'整体色泽强度','description'=>'影响绫亮度和屏幕内壁整体辉光','input_attrs'=>array('min'=>0,'max'=>150,'step'=>5))));

$c->add_setting('nbu_t_crt_edge_glow',array('default'=>60,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_edge_glow',array('section'=>'nbu_t_crt','label'=>'屏幕边缘内发光强度','description'=>'单独控制屏幕四周内壁辉光的明亮程度，数值越大边缘发光越明显','input_attrs'=>array('min'=>0,'max'=>150,'step'=>5))));

$c->add_setting('nbu_t_crt_eye_width',array('default'=>40,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_eye_width',array('section'=>'nbu_t_crt','label'=>'眼睛宽度','description'=>'占屏幕宽度的百分比，数值越大眼睛越宽','input_attrs'=>array('min'=>5,'max'=>80,'step'=>1))));

$c->add_setting('nbu_t_crt_eye_height',array('default'=>40,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_eye_height',array('section'=>'nbu_t_crt','label'=>'眼睛高度','description'=>'占屏幕高度的百分比，数值越大眼睛越高。宽高相等即为正方形/圆形，不等则为长方形','input_attrs'=>array('min'=>5,'max'=>80,'step'=>1))));

$c->add_setting('nbu_t_crt_eye_radius',array('default'=>50,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_crt_eye_radius',array('section'=>'nbu_t_crt','label'=>'眼睛圆角','description'=>'0为直角方形，50为完全圆形，中间数值为圆角矩形','input_attrs'=>array('min'=>0,'max'=>50,'step'=>1))));

$c->add_section('nbu_t_led',array('title'=>'顶部状态 LED','priority'=>32,'description'=>'主页右上角的网络终端主题顶栏状态指示灯'));

$c->add_setting('nbu_t_led_color',array('default'=>'#51d6a7','sanitize_callback'=>'sanitize_hex_color'));$c->add_control(new WP_Customize_Color_Control($c,'nbu_t_led_color',array('section'=>'nbu_t_led','label'=>'LED 颜色','description'=>'就绪状态下的指示灯颜色')));

$c->add_setting('nbu_t_led_brightness',array('default'=>100,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_led_brightness',array('section'=>'nbu_t_led','label'=>'LED 亮度','input_attrs'=>array('min'=>10,'max'=>200,'step'=>5))));

$c->add_setting('nbu_t_led_speed',array('default'=>26,'sanitize_callback'=>'absint'));$c->add_control(new NBU_T_Range_Control($c,'nbu_t_led_speed',array('section'=>'nbu_t_led','label'=>'闪烁频率','description'=>'微微呼吸效果的周期，数值越小闪烁越快（单位：0.1秒）','input_attrs'=>array('min'=>5,'max'=>60,'step'=>1))));

}add_action('customize_register','nbu_t_customize');

function nbu_t_body_class($classes){
$mode=get_theme_mod('nbu_t_crt_mode','scanline');
if($mode==='pixel')$classes[]='crt-mode-pixel';
return $classes;
}add_filter('body_class','nbu_t_body_class');

function nbu_t_vars(){ $ps=array('termius'=>array('#171924','#1d2033','#282b3d','#30344b','#ddddea','#a9abbb','#777b92','#7c83ff','#51d6a7','#f5c76e'),'nord'=>array('#2e3440','#292e39','#3b4252','#434c5e','#eceff4','#d8dee9','#81a1c1','#88c0d0','#a3be8c','#ebcb8b'),'dracula'=>array('#282a36','#21222c','#343746','#414558','#f8f8f2','#d9d5ef','#8b89a6','#bd93f9','#50fa7b','#f1fa8c'),'monokai'=>array('#272822','#20211d','#35362f','#414339','#f8f8f2','#d5d6c8','#8e9283','#a6e22e','#a6e22e','#e6db74'),'hackerblue'=>array('#071824','#0a2131','#0d2b3e','#12354b','#d8f1ff','#a9c9db','#668da2','#32a7ff','#2fe0a1','#f4cd70'),'hackergreen'=>array('#07130d','#0b1b12','#102519','#163322','#d8f7df','#a5ccb0','#5f8e6c','#4eea83','#4eea83','#e6d75d'),'flexoki'=>array('#1c1b1a','#242321','#302e2b','#3a3835','#cecdc3','#b7b5ac','#87847b','#d0a215','#879a39','#d0a215'),'light'=>array('#f4f5f8','#ffffff','#ffffff','#edf0f7','#20222a','#515767','#7a8090','#5765d9','#248b64','#a96b13'));$v=$ps[get_theme_mod('nbu_t_palette','termius')]??$ps['termius'];$n=array('--bg','--side','--panel','--raise','--text','--sub','--muted','--accent','--ok','--warn');$x=':root{';foreach($n as $i=>$k)$x.=$k.':'.$v[$i].';';$x.='--radius:'.absint(get_theme_mod('nbu_t_radius',16)).'px;';$d=get_theme_mod('nbu_t_density','comfortable');$x.='--density:'.($d==='compact'?'.84':($d==='spacious'?'1.18':'1')).';';

$x.='--crt-color:'.sanitize_hex_color(get_theme_mod('nbu_t_crt_color','#00ff41')).';';
$x.='--crt-case-color:'.sanitize_hex_color(get_theme_mod('nbu_t_crt_case_color','#26272b')).';';
$x.='--crt-ledon-color:'.sanitize_hex_color(get_theme_mod('nbu_t_crt_ledon_color','#2ee06a')).';';

$scanDensity=absint(get_theme_mod('nbu_t_crt_scanlines',35));$scanGap=max(2,round(6-($scanDensity/100)*4));
$x.='--crt-scan-gap:'.$scanGap.'px;';
$x.='--crt-scan-thickness:'.absint(get_theme_mod('nbu_t_crt_scanline_thickness',2)).'px;';
$scanAlphaPct=absint(get_theme_mod('nbu_t_crt_scan_alpha',35));$x.='--crt-scan-alpha:'.$scanAlphaPct.'%;';

$pixelSizePct=absint(get_theme_mod('nbu_t_crt_pixel_size',50));$pixelGap=max(2,round(10-($pixelSizePct/100)*8));
$x.='--crt-pixel-gap:'.$pixelGap.'px;';
$x.='--crt-pixel-thickness:'.absint(get_theme_mod('nbu_t_crt_pixel_thickness',1)).'px;';
$pixelAlphaPct=absint(get_theme_mod('nbu_t_crt_pixel_alpha',35));$x.='--crt-pixel-alpha:'.$pixelAlphaPct.'%;';

$glowPct=absint(get_theme_mod('nbu_t_crt_glow',50));$x.='--crt-glow-mult:'.round($glowPct/50,2).';';

$edgePct=absint(get_theme_mod('nbu_t_crt_edge_glow',60));$x.='--crt-edge-glow-mult:'.round($edgePct/50,2).';';

$eyeW=absint(get_theme_mod('nbu_t_crt_eye_width',40));$x.='--crt-eye-w:'.$eyeW.'cqw;';
$eyeH=absint(get_theme_mod('nbu_t_crt_eye_height',40));$x.='--crt-eye-h:'.$eyeH.'cqh;';
$eyeR=absint(get_theme_mod('nbu_t_crt_eye_radius',50));$x.='--crt-eye-radius:'.$eyeR.'%;';

$ledBrightness=absint(get_theme_mod('nbu_t_led_brightness',100));$x.='--led-brightness:'.round($ledBrightness/100,2).';';
$ledSpeed=absint(get_theme_mod('nbu_t_led_speed',26));$x.='--led-speed:'.round($ledSpeed/10,2).'s;';
$x.='--led-color:'.sanitize_hex_color(get_theme_mod('nbu_t_led_color','#51d6a7')).';';

$x.='}';wp_add_inline_style('nbu-terminal',$x);}add_action('wp_enqueue_scripts','nbu_t_vars',20);