<?php

namespace ILJ\Core;

use  ILJ\Core\Options ;
use  ILJ\Helper\Encoding ;
use  ILJ\Helper\Regex ;
use  ILJ\Type\Ruleset ;
use  ILJ\Database\Linkindex ;
use  ILJ\Helper\Replacement ;
use  ILJ\Backend\Editor ;
/**
 * The main LinkBuilder class
 *
 * Is responsible for editing a piece of content and setting links within by a given Ruleset
 *
 * @package ILJ\Core
 * @since   1.0.0
 */
class LinkBuilder
{
    /**
     * @var   int
     * @since 1.0.0
     */
    private  $id = null ;
    /**
     * @var   string
     * @since 1.0.1
     */
    private  $type = null ;
    /**
     * @var   Ruleset
     * @since 1.0.0
     */
    private  $link_ruleset = null ;
    /**
     * @var   Ruleset
     * @since 1.0.0
     */
    private  $replace_ruleset = null ;
    /**
     * @var   string
     * @since 1.0.0
     */
    private  $content = '' ;
    /**
     * Constructor of ILJ_LinkBuilder
     *
     * @since  1.0.1
     * @param  int    $id   The ID of the current subject
     * @param  string $type The type of the current subject
     * @return void
     */
    public function __construct( $id, $type )
    {
        $this->id = $id;
        $this->type = $type;
        $this->replace_ruleset = new Ruleset();
        $this->multi_keyword_mode = (bool) Options::getOption( \ILJ\Core\Options\MultipleKeywords::getKey() );
        $this->links_per_page = ( $this->multi_keyword_mode === false ? Options::getOption( \ILJ\Core\Options\LinksPerPage::getKey() ) : 0 );
        $this->links_per_target = ( $this->multi_keyword_mode === false ? Options::getOption( \ILJ\Core\Options\LinksPerTarget::getKey() ) : 0 );
        $this->setupInLinks();
    }
    
    /**
     * Loads all ingoing links to current content from linkindex table and sets a new Ruleset type with it
     *
     * @since  1.0.0
     * @return void
     */
    private function setupInLinks()
    {
        $this->link_ruleset = new Ruleset();
        $post_rules = Linkindex::getRules( $this->id, $this->type );
        foreach ( $post_rules as $post_rule ) {
            $this->link_ruleset->addRule( Regex::escapeDot( $post_rule->anchor ), $post_rule->link_to, $post_rule->type_to );
        }
        return;
    }
    
    /**
     * Applies the link rules to a given piece of content
     *
     * @since  1.0.0
     * @param  string $content The content of the post, where the rules get applied
     * @return string
     */
    public function linkContent( $content )
    {
        $this->content = $content;
        $this->replace_ruleset = Replacement::mask( $this->content );
        $this->maskLinkRules();
        $this->applyReplaceRules();
        return $this->content;
    }
    
    /**
     * Applies the given LinkRuleset for the document through masking within the content.
     *
     * @since  1.0.0
     * @return void
     */
    private function maskLinkRules()
    {
        $link_page_count = 0;
        $link_target_count = [];
        $used_pattern = [];
        
        if ( \ILJ\ilj_fs()->can_use_premium_code__premium_only() && $loop_thru_per_paragraph ) {
            $content_per_p = preg_split( "/(\r?\n){2}/", $this->content );
            $per_paragraph_temp_values = "";
            $full_content = "";
            foreach ( $content_per_p as $index => $paragraph ) {
                preg_match_all( '/<a.*href="(.*)".*>.*<\\/a>/sU', $paragraph, $existing_link );
                if ( !empty($existing_link) ) {
                    $linkcount_per_paragraph = count( $existing_link[0] );
                }
                $per_paragraph_temp_values = $this->createLinkIndex(
                    $paragraph,
                    $index,
                    $link_page_count,
                    $link_target_count,
                    $used_pattern,
                    $linkcount_per_paragraph,
                    $loop_thru_per_paragraph
                );
                $link_target_count = $per_paragraph_temp_values["link_target_count"];
                $used_pattern = $per_paragraph_temp_values["used_pattern"];
                $link_page_count = $per_paragraph_temp_values["link_page_count"];
                $full_content .= $per_paragraph_temp_values["content"];
                $this->link_ruleset->reset();
            }
        } else {
            $temp_values = $this->createLinkIndex(
                $this->content,
                0,
                $link_page_count,
                $link_target_count,
                $used_pattern,
                0,
                false
            );
            $full_content = $temp_values["content"];
            $this->link_ruleset->reset();
        }
        
        $this->content = $full_content;
    }
    
    /**
     * Runs Logical Checks For Linking Rules and settings
     *
     * @since 1.2.15
     * @param  string $content
     * @param  int $index
     * @param  int $link_page_count
     * @param  int $links_per_target
     * @param  array $used_pattern
     * @return array
     */
    protected function createLinkIndex(
        $content,
        $index,
        $link_page_count,
        $link_target_count,
        $used_pattern,
        $linkcount_per_paragraph,
        $loop_thru_per_paragraph
    )
    {
        while ( $this->link_ruleset->hasRule() ) {
            $link_rule = $this->link_ruleset->getRule();
            if ( $this->links_per_page > 0 && $link_page_count == $this->links_per_page ) {
                break;
            }
            
            if ( $this->links_per_target > 0 && array_key_exists( $link_rule->value, $link_target_count ) && $link_target_count[$link_rule->value] >= $this->links_per_target || !$this->multi_keyword_mode && in_array( $link_rule->pattern, $used_pattern ) ) {
                $this->link_ruleset->nextRule();
                continue;
            }
            
            if ( \ILJ\ilj_fs()->can_use_premium_code__premium_only() && $loop_thru_per_paragraph ) {
                
                if ( !$this->multi_keyword_mode && $linkcount_per_paragraph >= $this->links_per_paragraph && $this->links_per_paragraph != 0 && $this->links_per_paragraph != "" ) {
                    $this->link_ruleset->nextRule();
                    break;
                }
            
            }
            $pattern = wptexturize( $link_rule->pattern );
            preg_match_all( '/' . Encoding::maskPattern( $pattern ) . '/ui', $content, $rule_match );
            
            if ( !isset( $rule_match['phrase'] ) || !count( $rule_match['phrase'] ) ) {
                $this->link_ruleset->nextRule();
                continue;
            }
            
            $phrases = array_unique( $rule_match['phrase'] );
            foreach ( $phrases as $index2 => $rule ) {
                
                if ( $this->links_per_target > 0 && array_key_exists( $link_rule->value, $link_target_count ) && $link_target_count[$link_rule->value] == $this->links_per_target || !$this->multi_keyword_mode && in_array( $link_rule->pattern, $used_pattern ) ) {
                    $this->link_ruleset->nextRule();
                    continue 2;
                }
                
                $rule_id = 'ilj_' . uniqid( '', true );
                $link = $this->generateLink( $link_rule, esc_html( $rule ) );
                
                if ( !$link ) {
                    $this->link_ruleset->nextRule();
                    continue;
                }
                
                $content = preg_replace(
                    '/' . Encoding::maskPattern( $rule ) . '/ui',
                    $rule_id,
                    $content,
                    ( $this->multi_keyword_mode ? -1 : 1 )
                );
                $this->replace_ruleset->addRule( $rule_id, $link );
                if ( !array_key_exists( $link_rule->value, $link_target_count ) ) {
                    $link_target_count[$link_rule->value] = 0;
                }
                $used_pattern[] = $link_rule->pattern;
                $link_target_count[$link_rule->value]++;
                $link_page_count++;
            }
            $this->link_ruleset->nextRule();
        }
        $obj = array(
            "content"           => $content,
            "used_pattern"      => $used_pattern,
            "link_target_count" => $link_target_count,
            "link_page_count"   => $link_page_count,
        );
        return $obj;
    }
    
    /**
     * Applies the configured masks and replaces the placeholders with the generated links.
     *
     * @since  1.0.0
     * @return void
     */
    private function applyReplaceRules()
    {
        while ( $this->replace_ruleset->hasRule() ) {
            $replace_rule = $this->replace_ruleset->getRule();
            $this->content = str_replace( $replace_rule->pattern, $replace_rule->value, $this->content );
            $this->replace_ruleset->nextRule();
        }
        
        if ( preg_match( "/ilj\\_[a-z0-9]{14}\\.[0-9]{8}/", $this->content ) ) {
            $this->replace_ruleset->reset();
            $this->applyReplaceRules();
        }
        
        return;
    }
    
    /**
     * Returns the template for link output
     *
     * @since  1.0.0
     * @return string
     */
    private function getLinkTemplate()
    {
        $default_template = \ILJ\Core\Options\LinkOutputInternal::getDefault();
        $template = Options::getOption( \ILJ\Core\Options\LinkOutputInternal::getKey() );
        if ( $template == "" ) {
            return $default_template;
        }
        return wp_specialchars_decode( $template, \ENT_QUOTES );
    }
    
    /**
     * Generates the link markup
     *
     * @since  1.0.0
     * @param  string $post_id The post where the link should point to
     * @param  string $anchor  The anchortext for the link
     * @return bool|string
     */
    private function generateLink( $link_rule, $anchor )
    {
        $template = $this->getLinkTemplate();
        $nofollow = (bool) Options::getOption( \ILJ\Core\Options\InternalNofollow::getKey() );
        
        if ( $link_rule->type == 'post' ) {
            if ( get_post_status( $link_rule->value ) != 'publish' ) {
                return false;
            }
            $url = get_the_permalink( $link_rule->value );
        }
        
        $link = str_replace( '{{url}}', ( isset( $url ) ? $url : '#' ), $template );
        $link = str_replace( '{{anchor}}', $anchor, $link );
        $check_nofollow = true;
        if ( $check_nofollow && $nofollow ) {
            $link = str_replace( '<a ', '<a rel="nofollow" ', $link );
        }
        return $link;
    }

}