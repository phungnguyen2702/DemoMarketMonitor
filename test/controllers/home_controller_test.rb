require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get barchart" do
    get home_barchart_url
    assert_response :success
  end

  test "should get scatter" do
    get home_scatter_url
    assert_response :success
  end

end
