<?php
/**
 * Velaro
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category    Velaro
 * @package     Velaro_Chat
 * @copyright   Copyright (c) 2015 Velaro (http://www.velaro.com)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class Velaro_Chat_Block_Adminhtml_Chat extends Mage_Core_Block_Template
{
  public function __construct(array $args = array())
    {
        parent::__construct($args);
    }

     protected function _toHtml()
    {
            /* @var $block Mage_Core_Block_Template */
            $block = $this->getLayout()->createBlock(
                'core/template',
                'velaro_index',
                array(
                    'template' => 'velaro/settings.phtml'
                )
            );

            return $block->toHtml();
    }
}
?>
