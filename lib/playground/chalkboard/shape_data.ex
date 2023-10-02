defmodule Playground.Chalkboard.ShapeData do
  use Ecto.Schema
  import Ecto.Changeset
  alias Playground.Chalkboard.ShapeData

  @primary_key false
  @derive Jason.Encoder
  embedded_schema do
    embeds_one :attrs, Playground.Chalkboard.ShapeAttrs
    field :class_name, :string
  end

  @doc false
  def changeset(%ShapeData{} = shape_data, attrs) do
    shape_data
    |> cast(attrs, [:class_name])
    |> cast_embed(:attrs)
    |> validate_required([:class_name, :attrs])
  end
end
