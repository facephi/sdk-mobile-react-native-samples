import { SdkFinishStatus } from "@facephi/sdk-core-react-native/src/SdkCoreEnums";
import { selphid, SelphidConfiguration, SelphidResult } from "@facephi/sdk-selphid-react-native/src";
import { SdkDocumentType, SdkScanMode } from "@facephi/sdk-selphid-react-native/src/SdkSelphidEnums";
import { drawError } from "./core";

const getSelphidConfiguration = () => {
    let config: SelphidConfiguration = {
      debug: false,
      showResultAfterCapture: true,
      showTutorial: false,
      scanMode: SdkScanMode.Search,
      specificData: 'EC|<ALL>',
      documentType: SdkDocumentType.IdCard,
      fullscreen: true,
      resourcesPath: "fphi-selphid-widget-resources-sdk.zip",
    };
    return config;
};

export const startSelphid = async (
    operationId: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setSelphidResult: React.Dispatch<React.SetStateAction<SelphidResult|null>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => 
{ 
    try 
    {
      if (operationId == "") {
        console.log("OPERATION ID MUST BE GENERATED FIRST")
        return
      }

      console.log("Starting startSelphid...");
      setSelphidResult(null);

      return await selphid(getSelphidConfiguration())
      .then((result: any) => 
      {
        console.log("SelphidResult", result as SelphidResult)
        setSelphidResult(result);
        processSelphidResult(
            result,
            setMessage,
            setTextColorMessage,
            setShowError
        );
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