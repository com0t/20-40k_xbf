<?php

namespace ILJ\Core\IndexStrategy;

use  ILJ\Backend\Editor ;
use  ILJ\Core\Options ;
use  ILJ\Database\Linkindex ;
use  ILJ\Helper\Blacklist ;
use  ILJ\Helper\Encoding ;
use  ILJ\Helper\IndexAsset ;
use  ILJ\Helper\Replacement ;
use  ILJ\Helper\Url ;
/**
 *  The index builder strategy
 *
 *
 * @since 1.2.15
 */
class IndexStrategy
{
    /**
     * @var   Object
     * @since 1.2.15
     */
    protected  $data = array() ;
    /**
     * @var   String
     * @since 1.2.15
     */
    protected  $data_type = '' ;
    /**
     * @var   object
     * @since 1.2.15
     */
    protected  $link_rules = array() ;
    /**
     * @var   Array
     * @since 1.2.15
     */
    protected  $fields = array() ;
    /**
     * @var   int
     * @since 1.2.15
     */
    protected  $linkcount_per_paragraph = 0 ;
    /**
     * 
     * @var array
     * @since 1.2.15
     */
    protected  $blacklisted_posts = array() ;
    /**
     * 
     * @var array
     * @since 1.2.15
     */
    protected  $blacklisted_terms = array() ;
    /**
     * @var   array
     * @since 1.2.15
     */
    protected  $link_options = array() ;
    /**
     * @var   int
     * @since 1.0.1
     */
    protected  $counter = 0 ;
    /**
     * 
     * @var array
     * @since 1.2.17
     */
    protected  $incoming_link = array() ;
    public function __construct( $data_type, $fields, $link_options )
    {
        $this->fields = $fields;
        $this->data_type = $data_type;
        $this->link_options = $link_options;
        $this->setupLinkOptions();
    }
    
    /**
     * Setup the link options for link Limitations
     *
     * @return void
     */
    protected function setupLinkOptions()
    {
        $this->multi_keyword_mode = $this->link_options['multi_keyword_mode'];
        $this->links_per_page = $this->link_options['links_per_page'];
        $this->links_per_target = $this->link_options['links_per_target'];
        $this->blacklisted_posts = Blacklist::getBlacklistedList( "post" );
    }
    
    /**
     * Set the link Rules
     *
     * @param  array $link_rules
     * @return void
     */
    public function setLinkRules( $link_rules )
    {
        $this->link_rules = $link_rules;
    }
    
    /**
     * Loops thru given data and build Link Index
     *
     * @param  array $data
     * @return void
     */
    public function buildLinksPerData( $data )
    {
        $data_filtered = $data;
        foreach ( $data_filtered as $item ) {
            $linked_urls = [];
            $linked_anchors = [];
            $post_outlinks_count = 0;
            if ( !property_exists( $item, $this->fields['content'] ) || !property_exists( $item, $this->fields['id'] ) ) {
                continue;
            }
            $content = $item->{$this->fields['content']};
            if ( $this->data_type == 'post' ) {
                $this->filterTheContentWithoutTexturize( $content );
            }
            Replacement::mask( $content );
            $this->createLinkIndex(
                $content,
                0,
                $post_outlinks_count,
                $linked_urls,
                $linked_anchors,
                $item,
                0,
                false
            );
            $this->link_rules->reset();
        }
    }
    
    /**
     * Runs Logical Checks For Linking Rules and settings
     *
     * @param  String $content
     * @param  int $index
     * @param  int $post_outlinks_count
     * @param  array $linked_urls
     * @param  array $linked_anchors
     * @param  object $item
     * @param  int $linkcount_per_paragraph
     * @param  bool $loop_thru_per_paragraph
     * @return array
     */
    public function createLinkIndex(
        $content,
        $index,
        $post_outlinks_count,
        $linked_urls,
        $linked_anchors,
        $item,
        $linkcount_per_paragraph,
        $loop_thru_per_paragraph
    )
    {
        while ( $this->link_rules->hasRule() ) {
            $link_rule = $this->link_rules->getRule();
            if ( !isset( $linked_urls[$link_rule->value] ) ) {
                $linked_urls[$link_rule->value] = 0;
            }
            
            if ( !$this->multi_keyword_mode && ($this->links_per_page > 0 && $post_outlinks_count >= $this->links_per_page || $this->links_per_target > 0 && $linked_urls[$link_rule->value] >= $this->links_per_target) ) {
                $this->link_rules->nextRule();
                continue;
            }
            
            
            if ( $link_rule->type == "post" ) {
                $is_blacklisted_post = Blacklist::checkIfBlacklisted( $link_rule->type, $link_rule->value, $this->blacklisted_posts );
                
                if ( $is_blacklisted_post ) {
                    $this->link_rules->nextRule();
                    continue;
                }
            
            }
            
            
            if ( $link_rule->value != $item->{$this->fields['id']} ) {
                preg_match( '/' . Encoding::maskPattern( $link_rule->pattern ) . '/ui', $content, $rule_match );
                
                if ( isset( $rule_match['phrase'] ) ) {
                    $phrase = trim( $rule_match['phrase'] );
                    
                    if ( !$this->multi_keyword_mode && in_array( $phrase, $linked_anchors ) ) {
                        $this->link_rules->nextRule();
                        continue;
                    }
                    
                    $is_blacklisted_keyword = IndexAsset::checkIfBlacklistedKeyword( $item->{$this->fields['id']}, $phrase, $this->data_type );
                    
                    if ( $is_blacklisted_keyword ) {
                        $this->link_rules->nextRule();
                        continue;
                    }
                    
                    Linkindex::addRule(
                        $item->{$this->fields['id']},
                        $link_rule->value,
                        $phrase,
                        $this->data_type,
                        $link_rule->type
                    );
                    $this->counter++;
                    $post_outlinks_count++;
                    $linked_urls[$link_rule->value]++;
                    $linked_anchors[] = $phrase;
                }
            
            }
            
            $this->link_rules->nextRule();
        }
        $this->link_rules->reset();
        $obj = array(
            "linked_anchors"      => $linked_anchors,
            "linked_urls"         => $linked_urls,
            "post_outlinks_count" => $post_outlinks_count,
        );
        return $obj;
    }
    
    /**
     * Applies content filters to a given piece of content without calling
     * WordPress' texturize method (that escapes special chars like apostrophes)
     *
     * @since  1.2.9
     * @param  $content The content that gets filtered
     * @return void
     */
    protected function filterTheContentWithoutTexturize( &$content )
    {
        remove_filter( 'the_content', 'wptexturize' );
        $content = apply_filters( 'the_content', $content );
        add_filter( 'the_content', 'wptexturize' );
    }
    
    /**
     * Set the counter
     *
     * @param  intr $counter
     * @return void
     */
    public function setCounter( $counter )
    {
        $this->counter = $counter;
    }
    
    /**
     * Gets the currect counter value
     *
     * @return int $counter
     */
    public function getCounter()
    {
        return $this->counter;
    }

}