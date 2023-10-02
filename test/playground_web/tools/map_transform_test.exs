defmodule PlaygroundWeb.Tools.MapTransformTest do
  use ExUnit.Case
  alias PlaygroundWeb.Tools.MapTransform

  describe "transform_keys" do
    test "should update all the keys" do
      data = %{
        attrs: %{
          points: [207, 538, 207, 538, 207, 539, 207, 541, 207, 544, 207, 548, 207],
          global_composite_operation: "source-over",
          line_cap: "round",
          line_join: "round",
          stroke: "#000000",
          stroke_width: 5
        },
        class_name: "Line"
      }

      assert MapTransform.transform_keys(data, fn x -> to_string(x) |> String.upcase() end) == %{
               "CLASS_NAME" => "Line",
               "ATTRS" => %{
                 "GLOBAL_COMPOSITE_OPERATION" => "source-over",
                 "LINE_CAP" => "round",
                 "LINE_JOIN" => "round",
                 "POINTS" => [207, 538, 207, 538, 207, 539, 207, 541, 207, 544, 207, 548, 207],
                 "STROKE" => "#000000",
                 "STROKE_WIDTH" => 5
               }
             }
    end
  end
end
