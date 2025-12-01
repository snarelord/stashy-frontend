import AudioPreviewPage from "./AudioPreviewPage";

type PageProps = {
  params: Promise<{
    fileId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { fileId } = await params;
  return <AudioPreviewPage fileId={fileId} />;
}
