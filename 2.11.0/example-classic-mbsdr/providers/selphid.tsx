import { SdkFinishStatus } from "@facephi/sdk-core-react-native";
import { selphid, SelphidConfiguration, SelphidResult, SdkScanMode, SdkDocumentType, SdkCompressFormat } from "@facephi/sdk-selphid-mbsdr-react-native";
import { drawError } from "./core";

export const defaultSelphidConfiguration = (): SelphidConfiguration => ({
  showResultAfterCapture: true,
  showTutorial: false,
  showPreviousTip: true,
  showDiagnostic: true,
  compressFormat: SdkCompressFormat.JPEG,
  jpgQuality: 95,
  scanMode: SdkScanMode.Search,
  documentType: SdkDocumentType.IdCard,
});

export const startSelphid = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setSelphidResult: React.Dispatch<React.SetStateAction<SelphidResult|null>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    config: SelphidConfiguration,
) => 
{ 
    try 
    {
      console.log("Starting startSelphid...", config);
      setSelphidResult(null);

      return await selphid(config)
      .then((result: SelphidResult) => 
      {
        console.log("SelphidResult", result)
        setSelphidResult(result);
        processSelphidResult(result, setMessage, setTextColorMessage, setShowError);
      })
      .finally(()=> {
        console.log("End startSelphid...");
      });
    } 
    catch (error) 
    {
      console.log(error);
    }
};

const processSelphidResult = (
    result: SelphidResult,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => 
{
    switch (result.finishStatus) 
    {
      case SdkFinishStatus.Ok: // OK
          setShowError(false);
          setTextColorMessage('#777777');
        break;

      // Shows the result operation.
      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
            drawError(setMessage, setTextColorMessage, setShowError, result);
        }
        break;
    }
};