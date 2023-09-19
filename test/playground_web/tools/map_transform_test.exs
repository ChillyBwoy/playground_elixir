defmodule PlaygroundWeb.Tools.MapTransformTest do
  use ExUnit.Case
  alias PlaygroundWeb.Tools.MapTransform.{transform_keys}

  describe "transform_keys" do
    test "should update all the keys" do
      data = %{
        id: 1,
        type: "character",
        attrs: %{
          name: "Jo Jo"
        }
      }

      assert transform_keys(data, fn x -> to_string(x) |> String.upcase() end) %{
        ID: 1,
        TYPE: "character",
        ATTRS: %{
          NAME: "Jo Jo"
        }
      }
    end
  end
end
