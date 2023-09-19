defmodule Playground.Chalkboard.ShapeAttrs do
  use Ecto.Schema
  import Ecto.Changeset
  alias Playground.Chalkboard.ShapeAttrs

  embedded_schema do
    field :stroke, :string
    field :stroke_width, :integer
    field :line_cap, :string
    field :line_join, :string
    field :points, {:array, :integer}, default: []
  end

  @doc false
  def changeset(%ShapeAttrs{} = shape_attrs, attrs) do
    shape_attrs
    |> cast(attrs, [:stroke, :stroke_width, :line_cap, :line_join, :points])
    |> validate_required([:stroke, :stroke_width, :line_cap, :line_join, :points])
  end
end
