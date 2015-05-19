echo "wget canteen information file from endpoint";
wget -O tmp0 https://fenix.tecnico.ulisboa.pt/api/fenix/v1/canteen;
echo "Applying double quote escaping";
awk '{ gsub(/"/,"\\\"") } 1' tmp0 > tmp1;
echo "Adding surrounding double quotes";
echo "\"" | cat - tmp1 > tmp2
echo "\"" >> tmp2
echo "Removing newline ocurrences";
awk 1 ORS=' ' tmp2 > tmp3;
echo "Moving file to right directory";
cp tmp3 assets/resources/data.json;
echo "Removing tmp files";
rm tmp*;