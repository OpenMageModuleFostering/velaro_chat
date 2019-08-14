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
class Velaro_Chat_VelaroController extends Mage_Adminhtml_Controller_Action
{

    public function indexAction()
    {
        $this->loadLayout();
        $this->_setActiveMenu('velaro');
        $this->getLayout()->getBlock('velaro_index');
        $this->getLayout()->getBlock('velaro_footer');
        $this->renderLayout();
    }

    public function saveAction(){
        $form = $this->getRequest()->getPost();
        $configModel = new Mage_Core_Model_Config();
        $previousApiKey = Mage::getStoreConfig('velaro/velaroconfig/velaroapikey', Mage::app()->getStore());
        $siteId = $form['velaro_site_identifier'];
        $configModel->saveConfig('velaro/velaroconfig/siteIdentifier', $form['velaro_site_identifier']);
        $configModel->saveConfig('velaro/velaroconfig/velaroapikey', $form['velaro_api_key']);
        $configModel->saveConfig('velaro/velaroconfig/velaropageassignments', $form['velaro_page_assignments']);
        $configModel->saveConfig('velaro/velaroconfig/username', $form['velaro_username']);
        $configModel->saveConfig('velaro/velaroconfig/password', $form['velaro_password']);
        $configModel->saveConfig('velaro/velaroconfig/accountlinked', $form['velaro_site_identifier'] == '' ? 0 : 1);
        $configModel->saveConfig('velaro/velaroconfig/enabled', $form['velaro_enabled']);
        $configModel->saveConfig('velaro/velaroconfig/visitormonitoring', $form['velaro_visitor_monitoring']);

        //Api key changed, create the conversion
        if($previousApiKey != $form['velaro_api_key'] && $form['velaro_api_key'] != '')
        {
            $velaro_group_args = array('APIKEY' => $form['velaro_api_key'], 'Content-type' => 'application/json; charset=utf-8');
                    $velaro_api_url = Mage::getConfig()->getNode('default/velaro/velaroapimainurl');
                    $client = new Zend_Http_Client($velaro_api_url . '/v1/' . $siteId . '/Conversion/AddForPlugin');
                    $client->setHeaders($velaro_group_args);
                    $conversion = array(
                        'ConversionName'  => 'Magento Checkout',
                        'Url'   => Mage::helper('checkout/url')->getCheckoutUrl() . 'success/',
                        'DefaultDollarAmount' => '0',
                        'DollarAmountVariable' => 'MagentoCartTotal',
                        'AllowOnce' => 'false',
                    );
                    $json = Zend_Json::encode($conversion);
                    $response = $client->setRawData($json, 'application/json')->request('POST');
        }
        $this->_redirect('*/velaro/index');
    }

    protected function _isAllowed()
    {
        return Mage::getSingleton('admin/session')->isAllowed('velaro/index');
    }

}

?>

