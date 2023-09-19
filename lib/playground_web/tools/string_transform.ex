defmodule PlaygroundWeb.Tools.StringTransform do
  def snake_case_from(str) do
    snake_case_from_recur(str, "")
  end

  defp snake_case_from_recur(<<>>, acc), do: acc

  defp snake_case_from_recur(<<char::utf8, rest::binary>>, <<>> = acc) when char in ?A..?Z do
    snake_case_from_recur(rest, acc <> String.downcase(<<char>>))
  end

  defp snake_case_from_recur(<<char::utf8, rest::binary>>, acc) when char in ?A..?Z do
    snake_case_from_recur(rest, acc <> "_" <> String.downcase(<<char>>))
  end

  defp snake_case_from_recur(<<char::utf8, rest::binary>>, acc) do
    snake_case_from_recur(rest, acc <> <<char>>)
  end

  def camel_case_from(str) do
    camel_case_from_recur(str, "")
  end

  defp camel_case_from_recur(<<>>, acc), do: acc

  defp camel_case_from_recur(<<char::utf8>>, acc) when <<char>> == "_" do
    acc <> <<char>>
  end

  defp camel_case_from_recur(<<prefix::utf8, char::utf8, rest::binary>>, acc)
       when <<prefix>> == "_" and <<char>> == "_" do
    camel_case_from_recur(rest, acc <> <<prefix>> <> <<char>>)
  end

  defp camel_case_from_recur(<<prefix::utf8, char::utf8, rest::binary>>, acc)
       when <<prefix>> == "_" do
    camel_case_from_recur(rest, acc <> String.upcase(<<char>>))
  end

  defp camel_case_from_recur(<<char::utf8, rest::binary>>, acc) do
    camel_case_from_recur(rest, acc <> <<char>>)
  end
end
