defmodule Playground.Auth.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :username, :string
    field :provider, :string
    field :email, :string
    field :avatar_url, :string

    has_many :rooms, Playground.Chat.Room
    has_many :messages, Playground.Chat.Message

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :username, :avatar_url, :provider])
    |> validate_required([:email, :username, :avatar_url, :provider])
    |> unique_constraint(:username)
    |> unique_constraint(:email)
  end
end
