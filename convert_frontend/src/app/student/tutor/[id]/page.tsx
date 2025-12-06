import View from "./view";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function Page() {
  return <View />;
}
