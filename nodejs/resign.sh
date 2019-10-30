#!/bin/sh


FilePath=""
FileName=""
ShortName=""
APPName=""
SignIdentityName="iPhone Distribution: XXXX Network Technology Co., Ltd."  #换成自己公司的证书名称
Mobileprovision="45c96e88-27c8-4d46-a038-00cebaa5fe33.mobileprovision" #换成自己公司的mobileprovision
while getopts "P:N:S:" arg #选项后面的冒号表示该选项需要参数
do
        case $arg in
             P)
                FilePath=$OPTARG
                ;;
             N)
                FileName=$OPTARG
                ;;
             S)
                ShortName=$OPTARG
                ;;
             ?)  #当有不认识的选项的时候arg为?
            echo "含有未知参数"
        exit 1
        ;;
        esac
done

cd "${FilePath}"

# clear up  dir
if [ -d "${FilePath}${ShortName}" ]
then
rm -rf "${FilePath}${ShortName}"
fi
mkdir -p "${FilePath}${ShortName}"

unzip "${FileName}" -d "${FilePath}${ShortName}"

for filename in "${FilePath}${ShortName}/Payload/"*
do
    echo "YYUUU:${filename}"
    OLD_IFS="$IFS" #保存旧的分隔符
    IFS="/"
    array=($filename)
    IFS="$OLD_IFS" # 将IFS恢复成原来的
    for i in "${!array[@]}"; do
        APPName=${array[i]}
        echo "$i=>${APPName}"
    done
done

rm -rf "${ShortName}/Payload/${APPName}/_CodeSignature"
#替换mp
cp "${Mobileprovision}" "${ShortName}/Payload/${APPName}/embedded.mobileprovision"  

#-----------------------framework codesign-----------------
TARGET_APP_FRAMEWORKS_PATH="${ShortName}/Payload/${APPName}/Frameworks"
if [ -d "${TARGET_APP_FRAMEWORKS_PATH}" ];
then
for FRAMEWORK in "${TARGET_APP_FRAMEWORKS_PATH}/"*
do
#framework签名
codesign -f -s "${SignIdentityName}" "${FRAMEWORK}"
done
fi
#-----------------------framework codesign-----------------

#重签名
codesign -f -s "${SignIdentityName}" "${ShortName}/Payload/${APPName}" --entitlements entitlements.plist

cd "${ShortName}"

zip -r -q "${ShortName}_resign.ipa" "./"

