defmodule PlaygroundWeb.Tools.StringTransformTest do
  use ExUnit.Case
  alias PlaygroundWeb.Tools.StringTransform

  describe "snake_case_from" do
    test "should format string to snake_case" do
      assert StringTransform.snake_case_from("thisIsAVeryLongString") ==
               "this_is_a_very_long_string"
    end

    test "should format string with underscores from both sides to snake_case" do
      assert StringTransform.snake_case_from("_thisIsAVeryLongString_") ==
               "_this_is_a_very_long_string_"
    end
  end

  describe "camel_case_from" do
    test "should format string to camelCase" do
      assert StringTransform.camel_case_from("this_is_a_very_long_string") ==
               "thisIsAVeryLongString"
    end
  end
end
